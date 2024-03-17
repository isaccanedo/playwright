/*
  Copyright (c) Microsoft Corporation.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import React from 'react';

// Recalculates the value when dependencies change.
export function useAsyncMemo<T>(fn: () => Promise<T>, deps: React.DependencyList, initialValue: T, resetValue?: T) {
  const [value, setValue] = React.useState<T>(initialValue);
  React.useEffect(() => {
    let canceled = false;
    if (resetValue !== undefined)
      setValue(resetValue);
    fn().then(value => {
      if (!canceled)
        setValue(value);
    });
    return () => {
      canceled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return value;
}

// Tracks the element size and returns it's contentRect (always has x=0, y=0).
export function useMeasure<T extends Element>() {
  const ref = React.useRef<T | null>(null);
  const [measure, setMeasure] = React.useState(new DOMRect(0, 0, 10, 10));
  React.useLayoutEffect(() => {
    const target = ref.current;
    if (!target)
      return;
    const resizeObserver = new ResizeObserver((entries: any) => {
      const entry = entries[entries.length - 1];
      if (entry && entry.contentRect)
        setMeasure(entry.contentRect);
    });
    resizeObserver.observe(target);
    return () => resizeObserver.disconnect();
  }, [ref]);
  return [measure, ref] as const;
}

export function msToString(ms: number): string {
  if (!isFinite(ms))
    return '-';

  if (ms === 0)
    return '0';

  if (ms < 1000)
    return ms.toFixed(0) + 'ms';

  const seconds = ms / 1000;
  if (seconds < 60)
    return seconds.toFixed(1) + 's';

  const minutes = seconds / 60;
  if (minutes < 60)
    return minutes.toFixed(1) + 'm';

  const hours = minutes / 60;
  if (hours < 24)
    return hours.toFixed(1) + 'h';

  const days = hours / 24;
  return days.toFixed(1) + 'd';
}

export function bytesToString(bytes: number): string {
  if (bytes < 0 || !isFinite(bytes))
    return '-';

  if (bytes === 0)
    return '0';

  if (bytes < 1000)
    return bytes.toFixed(0);

  const kb = bytes / 1024;
  if (kb < 1000)
    return kb.toFixed(1) + 'K';

  const mb = kb / 1024;
  if (mb < 1000)
    return mb.toFixed(1) + 'M';

  const gb = mb / 1024;
  return gb.toFixed(1) + 'G';
}

export function lowerBound<S, T>(array: S[], object: T, comparator: (object: T, b: S) => number, left?: number, right?: number): number {
  let l = left || 0;
  let r = right !== undefined ? right : array.length;
  while (l < r) {
    const m = (l + r) >> 1;
    if (comparator(object, array[m]) > 0)
      l = m + 1;
    else
      r = m;
  }
  return r;
}

export function upperBound<S, T>(array: S[], object: T, comparator: (object: T, b: S) => number, left?: number, right?: number): number {
  let l = left || 0;
  let r = right !== undefined ? right : array.length;
  while (l < r) {
    const m = (l + r) >> 1;
    if (comparator(object, array[m]) >= 0)
      l = m + 1;
    else
      r = m;
  }
  return r;
}

export function copy(text: string) {
  const textArea = document.createElement('textarea');
  textArea.style.position = 'absolute';
  textArea.style.zIndex = '-1000';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  textArea.remove();
}

export function useSetting<S>(name: string | undefined, defaultValue: S): [S, React.Dispatch<React.SetStateAction<S>>] {
  const value = name ? settings.getObject(name, defaultValue) : defaultValue;
  const [state, setState] = React.useState<S>(value);
  const setStateWrapper = (value: React.SetStateAction<S>) => {
    if (name)
      settings.setObject(name, value);
    setState(value);
  };
  return [state, setStateWrapper];
}

export class Settings {
  getString(name: string, defaultValue: string): string {
    return localStorage[name] || defaultValue;
  }

  setString(name: string, value: string) {
    localStorage[name] = value;
    if ((window as any).saveSettings)
      (window as any).saveSettings();
  }

  getObject<T>(name: string, defaultValue: T): T {
    if (!localStorage[name])
      return defaultValue;
    try {
      return JSON.parse(localStorage[name]);
    } catch {
      return defaultValue;
    }
  }

  setObject<T>(name: string, value: T) {
    localStorage[name] = JSON.stringify(value);
    if ((window as any).saveSettings)
      (window as any).saveSettings();
  }
}

export const settings = new Settings();
