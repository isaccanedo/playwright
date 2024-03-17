import { test, expect } from '@playwright/experimental-ct-vue';
import DefaultSlot from '@/components/DefaultSlot.vue';
import NamedSlots from '@/components/NamedSlots.vue';

test('render a default slot', async ({ mount }) => {
  const component = await mount(DefaultSlot, {
    slots: {
      default: '<strong>Main Content</strong>',
    },
  });
  await expect(component.getByRole('strong')).toContainText('Main Content');
});

test('render a component as slot', async ({ mount }) => {
  const component = await mount(DefaultSlot, {
    slots: {
      default: '<Button title="Submit" />', // component is registered globally in /playwright/index.ts
    },
  });
  await expect(component).toContainText('Submit');
});

test('render a component with multiple slots', async ({ mount }) => {
  const component = await mount(DefaultSlot, {
    slots: {
      default: [
        '<div data-testid="one">One</div>',
        '<div data-testid="two">Two</div>',
      ],
    },
  });
  await expect(component.getByTestId('one')).toContainText('One');
  await expect(component.getByTestId('two')).toContainText('Two');
});

test('render a component with a named slot', async ({ mount }) => {
  const component = await mount(NamedSlots, {
    slots: {
      header: 'Header',
      main: 'Main Content',
      footer: 'Footer',
    },
  });
  await expect(component).toContainText('Header');
  await expect(component).toContainText('Main Content');
  await expect(component).toContainText('Footer');
});
