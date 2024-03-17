/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { closestCrossShadow, enclosingShadowRootOrDocument, getElementComputedStyle, isElementStyleVisibilityVisible, isVisibleTextNode, parentElementOrShadowHost } from './domUtils';

function hasExplicitAccessibleName(e: Element) {
  return e.hasAttribute('aria-label') || e.hasAttribute('aria-labelledby');
}

// https://www.w3.org/TR/wai-aria-practices/examples/landmarks/HTML5.html
const kAncestorPreventingLandmark = 'article:not([role]), aside:not([role]), main:not([role]), nav:not([role]), section:not([role]), [role=article], [role=complementary], [role=main], [role=navigation], [role=region]';

// https://www.w3.org/TR/wai-aria-1.2/#global_states
const kGlobalAriaAttributes = [
  'aria-atomic',
  'aria-busy',
  'aria-controls',
  'aria-current',
  'aria-describedby',
  'aria-details',
  'aria-disabled',
  'aria-dropeffect',
  'aria-errormessage',
  'aria-flowto',
  'aria-grabbed',
  'aria-haspopup',
  'aria-hidden',
  'aria-invalid',
  'aria-keyshortcuts',
  'aria-label',
  'aria-labelledby',
  'aria-live',
  'aria-owns',
  'aria-relevant',
  'aria-roledescription',
];

function hasGlobalAriaAttribute(e: Element) {
  return kGlobalAriaAttributes.some(a => e.hasAttribute(a));
}

// https://w3c.github.io/html-aam/#html-element-role-mappings
const kImplicitRoleByTagName: { [tagName: string]: (e: Element) => string | null } = {
  'A': (e: Element) => {
    return e.hasAttribute('href') ? 'link' : null;
  },
  'AREA': (e: Element) => {
    return e.hasAttribute('href') ? 'link' : null;
  },
  'ARTICLE': () => 'article',
  'ASIDE': () => 'complementary',
  'BLOCKQUOTE': () => 'blockquote',
  'BUTTON': () => 'button',
  'CAPTION': () => 'caption',
  'CODE': () => 'code',
  'DATALIST': () => 'listbox',
  'DD': () => 'definition',
  'DEL': () => 'deletion',
  'DETAILS': () => 'group',
  'DFN': () => 'term',
  'DIALOG': () => 'dialog',
  'DT': () => 'term',
  'EM': () => 'emphasis',
  'FIELDSET': () => 'group',
  'FIGURE': () => 'figure',
  'FOOTER': (e: Element) => closestCrossShadow(e, kAncestorPreventingLandmark) ? null : 'contentinfo',
  'FORM': (e: Element) => hasExplicitAccessibleName(e) ? 'form' : null,
  'H1': () => 'heading',
  'H2': () => 'heading',
  'H3': () => 'heading',
  'H4': () => 'heading',
  'H5': () => 'heading',
  'H6': () => 'heading',
  'HEADER': (e: Element) => closestCrossShadow(e, kAncestorPreventingLandmark) ? null : 'banner',
  'HR': () => 'separator',
  'HTML': () => 'document',
  'IMG': (e: Element) => (e.getAttribute('alt') === '') && !hasGlobalAriaAttribute(e) && Number.isNaN(Number(String(e.getAttribute('tabindex')))) ? 'presentation' : 'img',
  'INPUT': (e: Element) => {
    const type = (e as HTMLInputElement).type.toLowerCase();
    if (type === 'search')
      return e.hasAttribute('list') ? 'combobox' : 'searchbox';
    if (['email', 'tel', 'text', 'url', ''].includes(type)) {
      // https://html.spec.whatwg.org/multipage/input.html#concept-input-list
      const list = getIdRefs(e, e.getAttribute('list'))[0];
      return (list && list.tagName === 'DATALIST') ? 'combobox' : 'textbox';
    }
    if (type === 'hidden')
      return '';
    return {
      'button': 'button',
      'checkbox': 'checkbox',
      'image': 'button',
      'number': 'spinbutton',
      'radio': 'radio',
      'range': 'slider',
      'reset': 'button',
      'submit': 'button',
    }[type] || 'textbox';
  },
  'INS': () => 'insertion',
  'LI': () => 'listitem',
  'MAIN': () => 'main',
  'MARK': () => 'mark',
  'MATH': () => 'math',
  'MENU': () => 'list',
  'METER': () => 'meter',
  'NAV': () => 'navigation',
  'OL': () => 'list',
  'OPTGROUP': () => 'group',
  'OPTION': () => 'option',
  'OUTPUT': () => 'status',
  'P': () => 'paragraph',
  'PROGRESS': () => 'progressbar',
  'SECTION': (e: Element) => hasExplicitAccessibleName(e) ? 'region' : null,
  'SELECT': (e: Element) => e.hasAttribute('multiple') || (e as HTMLSelectElement).size > 1 ? 'listbox' : 'combobox',
  'STRONG': () => 'strong',
  'SUB': () => 'subscript',
  'SUP': () => 'superscript',
  // For <svg> we default to Chrome behavior:
  // - Chrome reports 'img'.
  // - Firefox reports 'diagram' that is not in official ARIA spec yet.
  // - Safari reports 'no role', but still computes accessible name.
  'SVG': () => 'img',
  'TABLE': () => 'table',
  'TBODY': () => 'rowgroup',
  'TD': (e: Element) => {
    const table = closestCrossShadow(e, 'table');
    const role = table ? getExplicitAriaRole(table) : '';
    return (role === 'grid' || role === 'treegrid') ? 'gridcell' : 'cell';
  },
  'TEXTAREA': () => 'textbox',
  'TFOOT': () => 'rowgroup',
  'TH': (e: Element) => {
    if (e.getAttribute('scope') === 'col')
      return 'columnheader';
    if (e.getAttribute('scope') === 'row')
      return 'rowheader';
    const table = closestCrossShadow(e, 'table');
    const role = table ? getExplicitAriaRole(table) : '';
    return (role === 'grid' || role === 'treegrid') ? 'gridcell' : 'cell';
  },
  'THEAD': () => 'rowgroup',
  'TIME': () => 'time',
  'TR': () => 'row',
  'UL': () => 'list',
};

const kPresentationInheritanceParents: { [tagName: string]: string[] } = {
  'DD': ['DL', 'DIV'],
  'DIV': ['DL'],
  'DT': ['DL', 'DIV'],
  'LI': ['OL', 'UL'],
  'TBODY': ['TABLE'],
  'TD': ['TR'],
  'TFOOT': ['TABLE'],
  'TH': ['TR'],
  'THEAD': ['TABLE'],
  'TR': ['THEAD', 'TBODY', 'TFOOT', 'TABLE'],
};

function getImplicitAriaRole(element: Element): string | null {
  // Elements from the svg namespace do not have uppercase tagName.
  const implicitRole = kImplicitRoleByTagName[element.tagName.toUpperCase()]?.(element) || '';
  if (!implicitRole)
    return null;
  // Inherit presentation role when required.
  // https://www.w3.org/TR/wai-aria-1.2/#conflict_resolution_presentation_none
  let ancestor: Element | null = element;
  while (ancestor) {
    const parent = parentElementOrShadowHost(ancestor);
    const parents = kPresentationInheritanceParents[ancestor.tagName];
    if (!parents || !parent || !parents.includes(parent.tagName))
      break;
    const parentExplicitRole = getExplicitAriaRole(parent);
    if ((parentExplicitRole === 'none' || parentExplicitRole === 'presentation') && !hasPresentationConflictResolution(parent))
      return parentExplicitRole;
    ancestor = parent;
  }
  return implicitRole;
}

// https://www.w3.org/TR/wai-aria-1.2/#role_definitions
const allRoles = [
  'alert', 'alertdialog', 'application', 'article', 'banner', 'blockquote', 'button', 'caption', 'cell', 'checkbox', 'code', 'columnheader', 'combobox', 'command',
  'complementary', 'composite', 'contentinfo', 'definition', 'deletion', 'dialog', 'directory', 'document', 'emphasis', 'feed', 'figure', 'form', 'generic', 'grid',
  'gridcell', 'group', 'heading', 'img', 'input', 'insertion', 'landmark', 'link', 'list', 'listbox', 'listitem', 'log', 'main', 'marquee', 'math', 'meter', 'menu',
  'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'navigation', 'none', 'note', 'option', 'paragraph', 'presentation', 'progressbar', 'radio', 'radiogroup',
  'range', 'region', 'roletype', 'row', 'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox', 'section', 'sectionhead', 'select', 'separator', 'slider',
  'spinbutton', 'status', 'strong', 'structure', 'subscript', 'superscript', 'switch', 'tab', 'table', 'tablist', 'tabpanel', 'term', 'textbox', 'time', 'timer',
  'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem', 'widget', 'window'
];
// https://www.w3.org/TR/wai-aria-1.2/#abstract_roles
const abstractRoles = ['command', 'composite', 'input', 'landmark', 'range', 'roletype', 'section', 'sectionhead', 'select', 'structure', 'widget', 'window'];
const validRoles = allRoles.filter(role => !abstractRoles.includes(role));

function getExplicitAriaRole(element: Element): string | null {
  // https://www.w3.org/TR/wai-aria-1.2/#document-handling_author-errors_roles
  const roles = (element.getAttribute('role') || '').split(' ').map(role => role.trim());
  return roles.find(role => validRoles.includes(role)) || null;
}

function hasPresentationConflictResolution(element: Element) {
  // https://www.w3.org/TR/wai-aria-1.2/#conflict_resolution_presentation_none
  // TODO: this should include "|| focusable" check.
  return !hasGlobalAriaAttribute(element);
}

export function getAriaRole(element: Element): string | null {
  const explicitRole = getExplicitAriaRole(element);
  if (!explicitRole)
    return getImplicitAriaRole(element);
  if ((explicitRole === 'none' || explicitRole === 'presentation') && hasPresentationConflictResolution(element))
    return getImplicitAriaRole(element);
  return explicitRole;
}

function getAriaBoolean(attr: string | null) {
  return attr === null ? undefined : attr.toLowerCase() === 'true';
}

// https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion, but including "none" and "presentation" roles
// Not implemented:
//   `Any descendants of elements that have the characteristic "Children Presentational: True"`
// https://www.w3.org/TR/wai-aria-1.2/#aria-hidden
export function isElementHiddenForAria(element: Element): boolean {
  if (['STYLE', 'SCRIPT', 'NOSCRIPT', 'TEMPLATE'].includes(element.tagName))
    return true;
  const style = getElementComputedStyle(element);
  const isSlot = element.nodeName === 'SLOT';
  if (style?.display === 'contents' && !isSlot) {
    // display:contents is not rendered itself, but its child nodes are.
    for (let child = element.firstChild; child; child = child.nextSibling) {
      if (child.nodeType === 1 /* Node.ELEMENT_NODE */ && !isElementHiddenForAria(child as Element))
        return false;
      if (child.nodeType === 3 /* Node.TEXT_NODE */ && isVisibleTextNode(child as Text))
        return false;
    }
    return true;
  }
  // Note: <option> inside <select> are not affected by visibility or content-visibility.
  // Same goes for <slot>.
  const isOptionInsideSelect = element.nodeName === 'OPTION' && !!element.closest('select');
  if (!isOptionInsideSelect && !isSlot && !isElementStyleVisibilityVisible(element, style))
    return true;
  return belongsToDisplayNoneOrAriaHiddenOrNonSlotted(element);
}

function belongsToDisplayNoneOrAriaHiddenOrNonSlotted(element: Element): boolean {
  let hidden = cacheIsHidden?.get(element);
  if (hidden === undefined) {
    hidden = false;

    // When parent has a shadow root, all light dom children must be assigned to a slot,
    // otherwise they are not rendered and considered hidden for aria.
    // Note: we can remove this logic once WebKit supports `Element.checkVisibility`.
    if (element.parentElement && element.parentElement.shadowRoot && !element.assignedSlot)
      hidden = true;

    // display:none and aria-hidden=true are considered hidden for aria.
    if (!hidden) {
      const style = getElementComputedStyle(element);
      hidden = !style || style.display === 'none' || getAriaBoolean(element.getAttribute('aria-hidden')) === true;
    }

    // Check recursively.
    if (!hidden) {
      const parent = parentElementOrShadowHost(element);
      if (parent)
        hidden = belongsToDisplayNoneOrAriaHiddenOrNonSlotted(parent);
    }
    cacheIsHidden?.set(element, hidden);
  }
  return hidden;
}

function getIdRefs(element: Element, ref: string | null): Element[] {
  if (!ref)
    return [];
  const root = enclosingShadowRootOrDocument(element);
  if (!root)
    return [];
  try {
    const ids = ref.split(' ').filter(id => !!id);
    const set = new Set<Element>();
    for (const id of ids) {
      // https://www.w3.org/TR/wai-aria-1.2/#mapping_additional_relations_error_processing
      // "If more than one element has the same ID, the user agent SHOULD use the first element found with the given ID"
      const firstElement = root.querySelector('#' + CSS.escape(id));
      if (firstElement)
        set.add(firstElement);
    }
    return [...set];
  } catch (e) {
    return [];
  }
}

function normalizeAccessbileName(s: string): string {
  // "Flat string" at https://w3c.github.io/accname/#terminology
  return s.replace(/\r\n/g, '\n').replace(/\u00A0/g, ' ').replace(/\s\s+/g, ' ').trim();
}

function queryInAriaOwned(element: Element, selector: string): Element[] {
  const result = [...element.querySelectorAll(selector)];
  for (const owned of getIdRefs(element, element.getAttribute('aria-owns'))) {
    if (owned.matches(selector))
      result.push(owned);
    result.push(...owned.querySelectorAll(selector));
  }
  return result;
}

function getPseudoContent(pseudoStyle: CSSStyleDeclaration | undefined) {
  if (!pseudoStyle)
    return '';
  const content = pseudoStyle.content;
  if ((content[0] === '\'' && content[content.length - 1] === '\'') ||
    (content[0] === '"' && content[content.length - 1] === '"')) {
    const unquoted = content.substring(1, content.length - 1);
    // SPEC DIFFERENCE.
    // Spec says "CSS textual content, without a space", but we account for display
    // to pass "name_file-label-inline-block-styles-manual.html"
    const display = pseudoStyle.display || 'inline';
    if (display !== 'inline')
      return ' ' + unquoted + ' ';
    return unquoted;
  }
  return '';
}

export function getAriaLabelledByElements(element: Element): Element[] | null {
  const ref = element.getAttribute('aria-labelledby');
  if (ref === null)
    return null;
  return getIdRefs(element, ref);
}

function allowsNameFromContent(role: string, targetDescendant: boolean) {
  // SPEC: https://w3c.github.io/aria/#namefromcontent
  //
  // Note: there is a spec proposal https://github.com/w3c/aria/issues/1821 that
  // is roughly aligned with what Chrome/Firefox do, and we follow that.
  //
  // See chromium implementation here:
  // https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/modules/accessibility/ax_object.cc;l=6338;drc=3decef66bc4c08b142a19db9628e9efe68973e64;bpv=0;bpt=1
  const alwaysAllowsNameFromContent = ['button', 'cell', 'checkbox', 'columnheader', 'gridcell', 'heading', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'row', 'rowheader', 'switch', 'tab', 'tooltip', 'treeitem'].includes(role);
  const descendantAllowsNameFromContent = targetDescendant && ['', 'caption', 'code', 'contentinfo', 'definition', 'deletion', 'emphasis', 'insertion', 'list', 'listitem', 'mark', 'none', 'paragraph', 'presentation', 'region', 'row', 'rowgroup', 'section', 'strong', 'subscript', 'superscript', 'table', 'term', 'time'].includes(role);
  return alwaysAllowsNameFromContent || descendantAllowsNameFromContent;
}

export function getElementAccessibleName(element: Element, includeHidden: boolean): string {
  const cache = (includeHidden ? cacheAccessibleNameHidden : cacheAccessibleName);
  let accessibleName = cache?.get(element);

  if (accessibleName === undefined) {
    // https://w3c.github.io/accname/#computation-steps
    accessibleName = '';

    // step 1.
    // https://w3c.github.io/aria/#namefromprohibited
    const elementProhibitsNaming = ['caption', 'code', 'definition', 'deletion', 'emphasis', 'generic', 'insertion', 'mark', 'paragraph', 'presentation', 'strong', 'subscript', 'suggestion', 'superscript', 'term', 'time'].includes(getAriaRole(element) || '');

    if (!elementProhibitsNaming) {
      // step 2.
      accessibleName = normalizeAccessbileName(getElementAccessibleNameInternal(element, {
        includeHidden,
        visitedElements: new Set(),
        embeddedInLabelledBy: 'none',
        embeddedInLabel: 'none',
        embeddedInTextAlternativeElement: false,
        embeddedInTargetElement: 'self',
      }));
    }

    cache?.set(element, accessibleName);
  }
  return accessibleName;
}

type AccessibleNameOptions = {
  includeHidden: boolean,
  visitedElements: Set<Element>,
  embeddedInLabelledBy: 'none' | 'self' | 'descendant',
  embeddedInLabel: 'none' | 'self' | 'descendant',
  embeddedInTextAlternativeElement: boolean,
  embeddedInTargetElement: 'none' | 'self' | 'descendant',
};

function getElementAccessibleNameInternal(element: Element, options: AccessibleNameOptions): string {
  if (options.visitedElements.has(element))
    return '';

  const childOptions: AccessibleNameOptions = {
    ...options,
    embeddedInLabel: options.embeddedInLabel === 'self' ? 'descendant' : options.embeddedInLabel,
    embeddedInLabelledBy: options.embeddedInLabelledBy === 'self' ? 'descendant' : options.embeddedInLabelledBy,
    embeddedInTargetElement: options.embeddedInTargetElement === 'self' ? 'descendant' : options.embeddedInTargetElement,
  };

  // step 2a.
  if (!options.includeHidden && options.embeddedInLabelledBy !== 'self' && isElementHiddenForAria(element)) {
    options.visitedElements.add(element);
    return '';
  }

  const labelledBy = getAriaLabelledByElements(element);

  // step 2b.
  if (options.embeddedInLabelledBy === 'none') {
    const accessibleName = (labelledBy || []).map(ref => getElementAccessibleNameInternal(ref, {
      ...options,
      embeddedInLabelledBy: 'self',
      embeddedInTargetElement: 'none',
      embeddedInLabel: 'none',
      embeddedInTextAlternativeElement: false,
    })).join(' ');
    if (accessibleName)
      return accessibleName;
  }

  const role = getAriaRole(element) || '';

  // step 2c.
  if (options.embeddedInLabel !== 'none' || options.embeddedInLabelledBy !== 'none') {
    const isOwnLabel = [...(element as (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)).labels || []].includes(element as any);
    const isOwnLabelledBy = (labelledBy || []).includes(element);
    if (!isOwnLabel && !isOwnLabelledBy) {
      if (role === 'textbox') {
        options.visitedElements.add(element);
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')
          return (element as HTMLInputElement | HTMLTextAreaElement).value;
        return element.textContent || '';
      }
      if (['combobox', 'listbox'].includes(role)) {
        options.visitedElements.add(element);
        let selectedOptions: Element[];
        if (element.tagName === 'SELECT') {
          selectedOptions = [...(element as HTMLSelectElement).selectedOptions];
          if (!selectedOptions.length && (element as HTMLSelectElement).options.length)
            selectedOptions.push((element as HTMLSelectElement).options[0]);
        } else {
          const listbox = role === 'combobox' ? queryInAriaOwned(element, '*').find(e => getAriaRole(e) === 'listbox') : element;
          selectedOptions = listbox ? queryInAriaOwned(listbox, '[aria-selected="true"]').filter(e => getAriaRole(e) === 'option') : [];
        }
        return selectedOptions.map(option => getElementAccessibleNameInternal(option, childOptions)).join(' ');
      }
      if (['progressbar', 'scrollbar', 'slider', 'spinbutton', 'meter'].includes(role)) {
        options.visitedElements.add(element);
        if (element.hasAttribute('aria-valuetext'))
          return element.getAttribute('aria-valuetext') || '';
        if (element.hasAttribute('aria-valuenow'))
          return element.getAttribute('aria-valuenow') || '';
        return element.getAttribute('value') || '';
      }
      if (['menu'].includes(role)) {
        // https://github.com/w3c/accname/issues/67#issuecomment-553196887
        options.visitedElements.add(element);
        return '';
      }
    }
  }

  // step 2d.
  const ariaLabel = element.getAttribute('aria-label') || '';
  if (ariaLabel.trim()) {
    options.visitedElements.add(element);
    return ariaLabel;
  }

  // step 2e.
  if (!['presentation', 'none'].includes(role)) {
    // https://w3c.github.io/html-aam/#input-type-button-input-type-submit-and-input-type-reset-accessible-name-computation
    //
    // SPEC DIFFERENCE.
    // Spec says to ignore this when aria-labelledby is defined.
    // WebKit follows the spec, while Chromium and Firefox do not.
    // We align with Chromium and Firefox here.
    if (element.tagName === 'INPUT' && ['button', 'submit', 'reset'].includes((element as HTMLInputElement).type)) {
      options.visitedElements.add(element);
      const value = (element as HTMLInputElement).value || '';
      if (value.trim())
        return value;
      if ((element as HTMLInputElement).type === 'submit')
        return 'Submit';
      if ((element as HTMLInputElement).type === 'reset')
        return 'Reset';
      const title = element.getAttribute('title') || '';
      return title;
    }

    // https://w3c.github.io/html-aam/#input-type-image-accessible-name-computation
    //
    // SPEC DIFFERENCE.
    // Spec says to ignore this when aria-labelledby is defined, but all browsers take it into account.
    if (element.tagName === 'INPUT' && (element as HTMLInputElement).type === 'image') {
      options.visitedElements.add(element);
      const labels = (element as HTMLInputElement).labels || [];
      if (labels.length && options.embeddedInLabelledBy === 'none')
        return getAccessibleNameFromAssociatedLabels(labels, options);
      const alt = element.getAttribute('alt') || '';
      if (alt.trim())
        return alt;
      const title = element.getAttribute('title') || '';
      if (title.trim())
        return title;
      // SPEC DIFFERENCE.
      // Spec says return localized "Submit Query", but browsers and axe-core insist on "Sumbit".
      return 'Submit';
    }

    // https://w3c.github.io/html-aam/#button-element-accessible-name-computation
    if (!labelledBy && element.tagName === 'BUTTON') {
      options.visitedElements.add(element);
      const labels = (element as HTMLButtonElement).labels || [];
      if (labels.length)
        return getAccessibleNameFromAssociatedLabels(labels, options);
      // From here, fallthrough to step 2f.
    }

    // https://w3c.github.io/html-aam/#output-element-accessible-name-computation
    if (!labelledBy && element.tagName === 'OUTPUT') {
      options.visitedElements.add(element);
      const labels = (element as HTMLOutputElement).labels || [];
      if (labels.length)
        return getAccessibleNameFromAssociatedLabels(labels, options);
      return element.getAttribute('title') || '';
    }

    // https://w3c.github.io/html-aam/#input-type-text-input-type-password-input-type-number-input-type-search-input-type-tel-input-type-email-input-type-url-and-textarea-element-accessible-name-computation
    // https://w3c.github.io/html-aam/#other-form-elements-accessible-name-computation
    // For "other form elements", we count select and any other input.
    //
    // Note: WebKit does not follow the spec and uses placeholder when aria-labelledby is present.
    if (!labelledBy && (element.tagName === 'TEXTAREA' || element.tagName === 'SELECT' || element.tagName === 'INPUT')) {
      options.visitedElements.add(element);
      const labels = (element as (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)).labels || [];
      if (labels.length)
        return getAccessibleNameFromAssociatedLabels(labels, options);

      const usePlaceholder = (element.tagName === 'INPUT' && ['text', 'password', 'search', 'tel', 'email', 'url'].includes((element as HTMLInputElement).type)) || element.tagName === 'TEXTAREA';
      const placeholder = element.getAttribute('placeholder') || '';
      const title = element.getAttribute('title') || '';
      if (!usePlaceholder || title)
        return title;
      return placeholder;
    }

    // https://w3c.github.io/html-aam/#fieldset-and-legend-elements
    if (!labelledBy && element.tagName === 'FIELDSET') {
      options.visitedElements.add(element);
      for (let child = element.firstElementChild; child; child = child.nextElementSibling) {
        if (child.tagName === 'LEGEND') {
          return getElementAccessibleNameInternal(child, {
            ...childOptions,
            embeddedInTextAlternativeElement: true,
          });
        }
      }
      const title = element.getAttribute('title') || '';
      return title;
    }

    // https://w3c.github.io/html-aam/#figure-and-figcaption-elements
    if (!labelledBy && element.tagName === 'FIGURE') {
      options.visitedElements.add(element);
      for (let child = element.firstElementChild; child; child = child.nextElementSibling) {
        if (child.tagName === 'FIGCAPTION') {
          return getElementAccessibleNameInternal(child, {
            ...childOptions,
            embeddedInTextAlternativeElement: true,
          });
        }
      }
      const title = element.getAttribute('title') || '';
      return title;
    }

    // https://w3c.github.io/html-aam/#img-element
    //
    // SPEC DIFFERENCE.
    // Spec says to ignore this when aria-labelledby is defined, but all browsers take it into account.
    if (element.tagName === 'IMG') {
      options.visitedElements.add(element);
      const alt = element.getAttribute('alt') || '';
      if (alt.trim())
        return alt;
      const title = element.getAttribute('title') || '';
      return title;
    }

    // https://w3c.github.io/html-aam/#table-element
    if (element.tagName === 'TABLE') {
      options.visitedElements.add(element);
      for (let child = element.firstElementChild; child; child = child.nextElementSibling) {
        if (child.tagName === 'CAPTION') {
          return getElementAccessibleNameInternal(child, {
            ...childOptions,
            embeddedInTextAlternativeElement: true,
          });
        }
      }
      // SPEC DIFFERENCE.
      // Spec does not say a word about <table summary="...">, but all browsers actually support it.
      const summary = element.getAttribute('summary') || '';
      if (summary)
        return summary;
      // SPEC DIFFERENCE.
      // Spec says "if the table element has a title attribute, then use that attribute".
      // We ignore title to pass "name_from_content-manual.html".
    }

    // https://w3c.github.io/html-aam/#area-element
    if (element.tagName === 'AREA') {
      options.visitedElements.add(element);
      const alt = element.getAttribute('alt') || '';
      if (alt.trim())
        return alt;
      const title = element.getAttribute('title') || '';
      return title;
    }

    // https://www.w3.org/TR/svg-aam-1.0/#mapping_additional_nd
    if (element.tagName.toUpperCase() === 'SVG' || (element as SVGElement).ownerSVGElement) {
      options.visitedElements.add(element);
      for (let child = element.firstElementChild; child; child = child.nextElementSibling) {
        if (child.tagName.toUpperCase() === 'TITLE' && (child as SVGElement).ownerSVGElement) {
          return getElementAccessibleNameInternal(child, {
            ...childOptions,
            embeddedInLabelledBy: 'self',
          });
        }
      }
    }
    if ((element as SVGElement).ownerSVGElement && element.tagName.toUpperCase() === 'A') {
      const title = element.getAttribute('xlink:title') || '';
      if (title.trim()) {
        options.visitedElements.add(element);
        return title;
      }
    }
  }

  // step 2f + step 2h.
  if (allowsNameFromContent(role, options.embeddedInTargetElement === 'descendant') ||
      options.embeddedInLabelledBy !== 'none' || options.embeddedInLabel !== 'none' ||
      options.embeddedInTextAlternativeElement) {
    options.visitedElements.add(element);
    const tokens: string[] = [];
    const visit = (node: Node, skipSlotted: boolean) => {
      if (skipSlotted && (node as Element | Text).assignedSlot)
        return;
      if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
        const display = getElementComputedStyle(node as Element)?.display || 'inline';
        let token = getElementAccessibleNameInternal(node as Element, childOptions);
        // SPEC DIFFERENCE.
        // Spec says "append the result to the accumulated text", assuming "with space".
        // However, multiple tests insist that inline elements do not add a space.
        // Additionally, <br> insists on a space anyway, see "name_file-label-inline-block-elements-manual.html"
        if (display !== 'inline' || node.nodeName === 'BR')
          token = ' ' + token + ' ';
        tokens.push(token);
      } else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
        // step 2g.
        tokens.push(node.textContent || '');
      }
    };
    tokens.push(getPseudoContent(getElementComputedStyle(element, '::before')));
    const assignedNodes = element.nodeName === 'SLOT' ? (element as HTMLSlotElement).assignedNodes() : [];
    if (assignedNodes.length) {
      for (const child of assignedNodes)
        visit(child, false);
    } else {
      for (let child = element.firstChild; child; child = child.nextSibling)
        visit(child, true);
      if (element.shadowRoot) {
        for (let child = element.shadowRoot.firstChild; child; child = child.nextSibling)
          visit(child, true);
      }
      for (const owned of getIdRefs(element, element.getAttribute('aria-owns')))
        visit(owned, true);
    }
    tokens.push(getPseudoContent(getElementComputedStyle(element, '::after')));
    const accessibleName = tokens.join('');
    if (accessibleName.trim())
      return accessibleName;
  }

  // step 2i.
  if (!['presentation', 'none'].includes(role) || element.tagName === 'IFRAME') {
    options.visitedElements.add(element);
    const title = element.getAttribute('title') || '';
    if (title.trim())
      return title;
  }

  options.visitedElements.add(element);
  return '';
}

export const kAriaSelectedRoles = ['gridcell', 'option', 'row', 'tab', 'rowheader', 'columnheader', 'treeitem'];
export function getAriaSelected(element: Element): boolean {
  // https://www.w3.org/TR/wai-aria-1.2/#aria-selected
  // https://www.w3.org/TR/html-aam-1.0/#html-attribute-state-and-property-mappings
  if (element.tagName === 'OPTION')
    return (element as HTMLOptionElement).selected;
  if (kAriaSelectedRoles.includes(getAriaRole(element) || ''))
    return getAriaBoolean(element.getAttribute('aria-selected')) === true;
  return false;
}

export const kAriaCheckedRoles = ['checkbox', 'menuitemcheckbox', 'option', 'radio', 'switch', 'menuitemradio', 'treeitem'];
export function getAriaChecked(element: Element): boolean | 'mixed' {
  const result = getChecked(element, true);
  return result === 'error' ? false : result;
}
export function getChecked(element: Element, allowMixed: boolean): boolean | 'mixed' | 'error' {
  // https://www.w3.org/TR/wai-aria-1.2/#aria-checked
  // https://www.w3.org/TR/html-aam-1.0/#html-attribute-state-and-property-mappings
  if (allowMixed && element.tagName === 'INPUT' && (element as HTMLInputElement).indeterminate)
    return 'mixed';
  if (element.tagName === 'INPUT' && ['checkbox', 'radio'].includes((element as HTMLInputElement).type))
    return (element as HTMLInputElement).checked;
  if (kAriaCheckedRoles.includes(getAriaRole(element) || '')) {
    const checked = element.getAttribute('aria-checked');
    if (checked === 'true')
      return true;
    if (allowMixed && checked === 'mixed')
      return 'mixed';
    return false;
  }
  return 'error';
}

export const kAriaPressedRoles = ['button'];
export function getAriaPressed(element: Element): boolean | 'mixed' {
  // https://www.w3.org/TR/wai-aria-1.2/#aria-pressed
  if (kAriaPressedRoles.includes(getAriaRole(element) || '')) {
    const pressed = element.getAttribute('aria-pressed');
    if (pressed === 'true')
      return true;
    if (pressed === 'mixed')
      return 'mixed';
  }
  return false;
}

export const kAriaExpandedRoles = ['application', 'button', 'checkbox', 'combobox', 'gridcell', 'link', 'listbox', 'menuitem', 'row', 'rowheader', 'tab', 'treeitem', 'columnheader', 'menuitemcheckbox', 'menuitemradio', 'rowheader', 'switch'];
export function getAriaExpanded(element: Element): boolean | 'none' {
  // https://www.w3.org/TR/wai-aria-1.2/#aria-expanded
  // https://www.w3.org/TR/html-aam-1.0/#html-attribute-state-and-property-mappings
  if (element.tagName === 'DETAILS')
    return (element as HTMLDetailsElement).open;
  if (kAriaExpandedRoles.includes(getAriaRole(element) || '')) {
    const expanded = element.getAttribute('aria-expanded');
    if (expanded === null)
      return 'none';
    if (expanded === 'true')
      return true;
    return false;
  }
  return 'none';
}

export const kAriaLevelRoles = ['heading', 'listitem', 'row', 'treeitem'];
export function getAriaLevel(element: Element): number {
  // https://www.w3.org/TR/wai-aria-1.2/#aria-level
  // https://www.w3.org/TR/html-aam-1.0/#html-attribute-state-and-property-mappings
  const native = { 'H1': 1, 'H2': 2, 'H3': 3, 'H4': 4, 'H5': 5, 'H6': 6 }[element.tagName];
  if (native)
    return native;
  if (kAriaLevelRoles.includes(getAriaRole(element) || '')) {
    const attr = element.getAttribute('aria-level');
    const value = attr === null ? Number.NaN : Number(attr);
    if (Number.isInteger(value) && value >= 1)
      return value;
  }
  return 0;
}

export const kAriaDisabledRoles = ['application', 'button', 'composite', 'gridcell', 'group', 'input', 'link', 'menuitem', 'scrollbar', 'separator', 'tab', 'checkbox', 'columnheader', 'combobox', 'grid', 'listbox', 'menu', 'menubar', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'radiogroup', 'row', 'rowheader', 'searchbox', 'select', 'slider', 'spinbutton', 'switch', 'tablist', 'textbox', 'toolbar', 'tree', 'treegrid', 'treeitem'];
export function getAriaDisabled(element: Element): boolean {
  // https://www.w3.org/TR/wai-aria-1.2/#aria-disabled
  // https://www.w3.org/TR/html-aam-1.0/#html-attribute-state-and-property-mappings
  // Note that aria-disabled applies to all descendants, so we look up the hierarchy.
  const isNativeFormControl = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'OPTION', 'OPTGROUP'].includes(element.tagName);
  if (isNativeFormControl && (element.hasAttribute('disabled') || belongsToDisabledFieldSet(element)))
    return true;
  return hasExplicitAriaDisabled(element);
}

function belongsToDisabledFieldSet(element: Element | null): boolean {
  if (!element)
    return false;
  if (element.tagName === 'FIELDSET' && element.hasAttribute('disabled'))
    return true;
  // fieldset does not work across shadow boundaries.
  return belongsToDisabledFieldSet(element.parentElement);
}

function hasExplicitAriaDisabled(element: Element | undefined): boolean {
  if (!element)
    return false;
  if (kAriaDisabledRoles.includes(getAriaRole(element) || '')) {
    const attribute = (element.getAttribute('aria-disabled') || '').toLowerCase();
    if (attribute === 'true')
      return true;
    if (attribute === 'false')
      return false;
  }
  // aria-disabled works across shadow boundaries.
  return hasExplicitAriaDisabled(parentElementOrShadowHost(element));
}

function getAccessibleNameFromAssociatedLabels(labels: Iterable<HTMLLabelElement>, options: AccessibleNameOptions) {
  return [...labels].map(label => getElementAccessibleNameInternal(label, {
    ...options,
    embeddedInLabel: 'self',
    embeddedInTextAlternativeElement: false,
    embeddedInLabelledBy: 'none',
    embeddedInTargetElement: 'none',
  })).filter(accessibleName => !!accessibleName).join(' ');
}

let cacheAccessibleName: Map<Element, string> | undefined;
let cacheAccessibleNameHidden: Map<Element, string> | undefined;
let cacheIsHidden: Map<Element, boolean> | undefined;
let cachesCounter = 0;

export function beginAriaCaches() {
  ++cachesCounter;
  cacheAccessibleName ??= new Map();
  cacheAccessibleNameHidden ??= new Map();
  cacheIsHidden ??= new Map();
}

export function endAriaCaches() {
  if (!--cachesCounter) {
    cacheAccessibleName = undefined;
    cacheAccessibleNameHidden = undefined;
    cacheIsHidden = undefined;
  }
}
