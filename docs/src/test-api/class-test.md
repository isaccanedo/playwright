# class: Test
* since: v1.10
* langs: js

Playwright Test provides a `test` function to declare tests and `expect` function to write assertions.

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  const name = await page.innerText('.navbar__title');
  expect(name).toBe('Playwright');
});
```

## method: Test.(call)
* since: v1.10

Declares a test.

**Usage**

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // ...
});
```

### param: Test.(call).title
* since: v1.10
- `title` <[string]>

Test title.

### param: Test.(call).testFunction
* since: v1.10
- `testFunction` <[function]\([Fixtures], [TestInfo]\)>

Test function that takes one or two arguments: an object with fixtures and optional [TestInfo].



## method: Test.afterAll#1
* since: v1.10

Declares an `afterAll` hook that is executed once per worker after all tests.

**Details**

When called in the scope of a test file, runs after all tests in the file. When called inside a [`method: Test.describe#1`] group, runs after all tests in the group. If multiple `afterAll` hooks are added, they will run in the order of their registration.

Note that worker process is restarted on test failures, and `afterAll` hook runs again in the new worker. Learn more about [workers and failures](../test-retries.md).

Playwright will continue running all applicable hooks even if some of them have failed.

**Usage**

```js
test.afterAll(async () => {
  console.log('Done with tests');
  // ...
});
```

### param: Test.afterAll#1.hookFunction
* since: v1.10
- `hookFunction` <[function]\([Fixtures], [TestInfo]\)>

Hook function that takes one or two arguments: an object with worker fixtures and optional [TestInfo].


## method: Test.afterAll#2
* since: v1.38

Declares an `afterAll` hook with a title that is executed once per worker after all tests.

**Details**

See [`method: Test.afterAll#1`].

**Usage**

```js
test.afterAll('Teardown', async () => {
  console.log('Done with tests');
  // ...
});
```

### param: Test.afterAll#2.title
* since: v1.38
- `title` <[string]>

Hook title.

### param: Test.afterAll#2.hookFunction
* since: v1.38
- `hookFunction` <[function]\([Fixtures], [TestInfo]\)>

Hook function that takes one or two arguments: an object with worker fixtures and optional [TestInfo].



## method: Test.afterEach#1
* since: v1.10

Declares an `afterEach` hook that is executed after each test.

**Details**

When called in the scope of a test file, runs after each test in the file. When called inside a [`method: Test.describe#1`] group, runs after each test in the group. If multiple `afterEach` hooks are added, they will run in the order of their registration.

You can access all the same [Fixtures] as the test function itself, and also the [TestInfo] object that gives a lot of useful information. For example, you can check whether the test succeeded or failed.

Playwright will continue running all applicable hooks even if some of them have failed.

**Usage**

```js title="example.spec.ts"
import { test, expect } from '@playwright/test';

test.afterEach(async ({ page }, testInfo) => {
  console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);

  if (testInfo.status !== testInfo.expectedStatus)
    console.log(`Did not run as expected, ended up at ${page.url()}`);
});

test('my test', async ({ page }) => {
  // ...
});
```

### param: Test.afterEach#1.hookFunction
* since: v1.10
- `hookFunction` <[function]\([Fixtures], [TestInfo]\)>

Hook function that takes one or two arguments: an object with fixtures and optional [TestInfo].


## method: Test.afterEach#2
* since: v1.38

Declares an `afterEach` hook with a title that is executed after each test.

**Details**

See [`method: Test.afterEach#1`].

**Usage**

```js title="example.spec.ts"
import { test, expect } from '@playwright/test';

test.afterEach('Status check', async ({ page }, testInfo) => {
  console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);

  if (testInfo.status !== testInfo.expectedStatus)
    console.log(`Did not run as expected, ended up at ${page.url()}`);
});

test('my test', async ({ page }) => {
  // ...
});
```

### param: Test.afterEach#2.title
* since: v1.38
- `title` <[string]>

Hook title.

### param: Test.afterEach#2.hookFunction
* since: v1.38
- `hookFunction` <[function]\([Fixtures], [TestInfo]\)>

Hook function that takes one or two arguments: an object with fixtures and optional [TestInfo].



## method: Test.beforeAll#1
* since: v1.10

Declares a `beforeAll` hook that is executed once per worker process before all tests.

**Details**

When called in the scope of a test file, runs before all tests in the file. When called inside a [`method: Test.describe#1`] group, runs before all tests in the group. If multiple `beforeAll` hooks are added, they will run in the order of their registration.

Note that worker process is restarted on test failures, and `beforeAll` hook runs again in the new worker. Learn more about [workers and failures](../test-retries.md).

Playwright will continue running all applicable hooks even if some of them have failed.

You can use [`method: Test.afterAll#1`] to teardown any resources set up in `beforeAll`.

**Usage**

```js title="example.spec.ts"
import { test, expect } from '@playwright/test';

test.beforeAll(async () => {
  console.log('Before tests');
});

test.afterAll(async () => {
  console.log('After tests');
});

test('my test', async ({ page }) => {
  // ...
});
```

### param: Test.beforeAll#1.hookFunction
* since: v1.10
- `hookFunction` <[function]\([Fixtures], [TestInfo]\)>

Hook function that takes one or two arguments: an object with worker fixtures and optional [TestInfo].


## method: Test.beforeAll#2
* since: v1.38

Declares a `beforeAll` hook with a title that is executed once per worker process before all tests.

**Details**

See [`method: Test.beforeAll#1`].

**Usage**

```js title="example.spec.ts"
import { test, expect } from '@playwright/test';

test.beforeAll('Setup', async () => {
  console.log('Before tests');
});

test('my test', async ({ page }) => {
  // ...
});
```

### param: Test.beforeAll#2.title
* since: v1.38
- `title` <[string]>

Hook title.

### param: Test.beforeAll#2.hookFunction
* since: v1.38
- `hookFunction` <[function]\([Fixtures], [TestInfo]\)>

Hook function that takes one or two arguments: an object with worker fixtures and optional [TestInfo].



## method: Test.beforeEach#1
* since: v1.10

Declares a `beforeEach` hook that is executed before each test.

**Details**

When called in the scope of a test file, runs before each test in the file. When called inside a [`method: Test.describe#1`] group, runs before each test in the group.  If multiple `beforeEach` hooks are added, they will run in the order of their registration.

You can access all the same [Fixtures] as the test function itself, and also the [TestInfo] object that gives a lot of useful information. For example, you can navigate the page before starting the test.

Playwright will continue running all applicable hooks even if some of them have failed.

You can use [`method: Test.afterEach#1`] to teardown any resources set up in `beforeEach`.

**Usage**

```js title="example.spec.ts"
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  console.log(`Running ${testInfo.title}`);
  await page.goto('https://my.start.url/');
});

test('my test', async ({ page }) => {
  expect(page.url()).toBe('https://my.start.url/');
});
```

### param: Test.beforeEach#1.hookFunction
* since: v1.10
- `hookFunction` <[function]\([Fixtures], [TestInfo]\)>

Hook function that takes one or two arguments: an object with fixtures and optional [TestInfo].


## method: Test.beforeEach#2
* since: v1.38

Declares a `beforeEach` hook with a title that is executed before each test.

**Details**

See [`method: Test.beforeEach#1`].

**Usage**

```js title="example.spec.ts"
import { test, expect } from '@playwright/test';

test.beforeEach('Open start URL', async ({ page }, testInfo) => {
  console.log(`Running ${testInfo.title}`);
  await page.goto('https://my.start.url/');
});

test('my test', async ({ page }) => {
  expect(page.url()).toBe('https://my.start.url/');
});
```

### param: Test.beforeEach#2.title
* since: v1.38
- `title` <[string]>

Hook title.

### param: Test.beforeEach#2.hookFunction
* since: v1.38
- `hookFunction` <[function]\([Fixtures], [TestInfo]\)>

Hook function that takes one or two arguments: an object with fixtures and optional [TestInfo].



## method: Test.describe#1
* since: v1.10

Declares a group of tests.

**Usage**

```js
test.describe('two tests', () => {
  test('one', async ({ page }) => {
    // ...
  });

  test('two', async ({ page }) => {
    // ...
  });
});
```

### param: Test.describe#1.title
* since: v1.10
- `title` <[string]>

Group title.

### param: Test.describe#1.callback
* since: v1.10
- `callback` <[function]>

A callback that is run immediately when calling [`method: Test.describe#1`]. Any tests added in this callback will belong to the group.


## method: Test.describe#2
* since: v1.24

Declares an anonymous group of tests. This is convenient to give a group of tests a common option with [`method: Test.use`].

**Usage**

```js
test.describe(() => {
  test.use({ colorScheme: 'dark' });

  test('one', async ({ page }) => {
    // ...
  });

  test('two', async ({ page }) => {
    // ...
  });
});
```

### param: Test.describe#2.callback
* since: v1.24
- `callback` <[function]>

A callback that is run immediately when calling [`method: Test.describe#2`]. Any tests added in this callback will belong to the group.



## method: Test.describe.configure
* since: v1.10

Configures the enclosing scope. Can be executed either on the top level or inside a describe. Configuration applies to the entire scope, regardless of whether it run before or after the test declaration.

Learn more about the execution modes [here](../test-parallel.md).

**Usage**

* Running tests in parallel.

  ```js
  // Run all the tests in the file concurrently using parallel workers.
  test.describe.configure({ mode: 'parallel' });
  test('runs in parallel 1', async ({ page }) => {});
  test('runs in parallel 2', async ({ page }) => {});
  ```

* Running tests serially, retrying from the start.

  :::note
  Running serially is not recommended. It is usually better to make your tests isolated, so they can be run independently.
  :::

  ```js
  // Annotate tests as inter-dependent.
  test.describe.configure({ mode: 'serial' });
  test('runs first', async ({ page }) => {});
  test('runs second', async ({ page }) => {});
  ```

* Configuring retries and timeout for each test.

  ```js
  // Each test in the file will be retried twice and have a timeout of 20 seconds.
  test.describe.configure({ retries: 2, timeout: 20_000 });
  test('runs first', async ({ page }) => {});
  test('runs second', async ({ page }) => {});
  ```

* Run multiple describes in parallel, but tests inside each describe in order.

  ```js
  test.describe.configure({ mode: 'parallel' });

  test.describe('A, runs in parallel with B', () => {
    test.describe.configure({ mode: 'default' });
    test('in order A1', async ({ page }) => {});
    test('in order A2', async ({ page }) => {});
  });

  test.describe('B, runs in parallel with A', () => {
    test.describe.configure({ mode: 'default' });
    test('in order B1', async ({ page }) => {});
    test('in order B2', async ({ page }) => {});
  });
  ```

### option: Test.describe.configure.mode
* since: v1.10
- `mode` <[TestMode]<"default"|"parallel"|"serial">>

Execution mode. Learn more about the execution modes [here](../test-parallel.md).

### option: Test.describe.configure.retries
* since: v1.28
- `retries` <[int]>

The number of retries for each test.

### option: Test.describe.configure.timeout
* since: v1.28
- `timeout` <[int]>

Timeout for each test in milliseconds. Overrides [`property: TestProject.timeout`] and [`property: TestConfig.timeout`].


## method: Test.describe.fixme
* since: v1.25

Declares a test group similarly to [`method: Test.describe#1`]. Tests in this group are marked as "fixme" and will not be executed.

**Usage**

```js
test.describe.fixme('broken tests', () => {
  test('example', async ({ page }) => {
    // This test will not run
  });
});
```

### param: Test.describe.fixme.title
* since: v1.25
- `title` <[string]>

Group title.

### param: Test.describe.fixme.callback
* since: v1.25
- `callback` <[function]>

A callback that is run immediately when calling [`method: Test.describe.fixme`]. Any tests added in this callback will belong to the group, and will not be run.



## method: Test.describe.only
* since: v1.10

Declares a focused group of tests. If there are some focused tests or suites, all of them will be run but nothing else.

**Usage**

```js
test.describe.only('focused group', () => {
  test('in the focused group', async ({ page }) => {
    // This test will run
  });
});
test('not in the focused group', async ({ page }) => {
  // This test will not run
});
```

### param: Test.describe.only.title
* since: v1.10
- `title` <[string]>

Group title.

### param: Test.describe.only.callback
* since: v1.10
- `callback` <[function]>

A callback that is run immediately when calling [`method: Test.describe.only`]. Any tests added in this callback will belong to the group.



## method: Test.describe.parallel
* since: v1.10
* discouraged: See [`method: Test.describe.configure`] for the preferred way of configuring the execution mode.

Declares a group of tests that could be run in parallel. By default, tests in a single test file run one after another, but using [`method: Test.describe.parallel`] allows them to run in parallel.

**Usage**

```js
test.describe.parallel('group', () => {
  test('runs in parallel 1', async ({ page }) => {});
  test('runs in parallel 2', async ({ page }) => {});
});
```

Note that parallel tests are executed in separate processes and cannot share any state or global variables. Each of the parallel tests executes all relevant hooks.

### param: Test.describe.parallel.title
* since: v1.10
- `title` <[string]>

Group title.

### param: Test.describe.parallel.callback
* since: v1.10
- `callback` <[function]>

A callback that is run immediately when calling [`method: Test.describe.parallel`]. Any tests added in this callback will belong to the group.



## method: Test.describe.parallel.only
* since: v1.10
* discouraged: See [`method: Test.describe.configure`] for the preferred way of configuring the execution mode.

Declares a focused group of tests that could be run in parallel. This is similar to [`method: Test.describe.parallel`], but focuses the group. If there are some focused tests or suites, all of them will be run but nothing else.

**Usage**

```js
test.describe.parallel.only('group', () => {
  test('runs in parallel 1', async ({ page }) => {});
  test('runs in parallel 2', async ({ page }) => {});
});
```

### param: Test.describe.parallel.only.title
* since: v1.10
- `title` <[string]>

Group title.

### param: Test.describe.parallel.only.callback
* since: v1.10
- `callback` <[function]>

A callback that is run immediately when calling [`method: Test.describe.parallel.only`]. Any tests added in this callback will belong to the group.



## method: Test.describe.serial
* since: v1.10
* discouraged: See [`method: Test.describe.configure`] for the preferred way of configuring the execution mode.

Declares a group of tests that should always be run serially. If one of the tests fails, all subsequent tests are skipped. All tests in a group are retried together.

:::note
Using serial is not recommended. It is usually better to make your tests isolated, so they can be run independently.
:::

**Usage**

```js
test.describe.serial('group', () => {
  test('runs first', async ({ page }) => {});
  test('runs second', async ({ page }) => {});
});
```

### param: Test.describe.serial.title
* since: v1.10
- `title` <[string]>

Group title.

### param: Test.describe.serial.callback
* since: v1.10
- `callback` <[function]>

A callback that is run immediately when calling [`method: Test.describe.serial`]. Any tests added in this callback will belong to the group.



## method: Test.describe.serial.only
* since: v1.10
* discouraged: See [`method: Test.describe.configure`] for the preferred way of configuring the execution mode.

Declares a focused group of tests that should always be run serially. If one of the tests fails, all subsequent tests are skipped. All tests in a group are retried together. If there are some focused tests or suites, all of them will be run but nothing else.

:::note
Using serial is not recommended. It is usually better to make your tests isolated, so they can be run independently.
:::

**Usage**

```js
test.describe.serial.only('group', () => {
  test('runs first', async ({ page }) => {
  });
  test('runs second', async ({ page }) => {
  });
});
```

### param: Test.describe.serial.only.title
* since: v1.10
- `title` <[string]>

Group title.

### param: Test.describe.serial.only.callback
* since: v1.10
- `callback` <[function]>

A callback that is run immediately when calling [`method: Test.describe.serial.only`]. Any tests added in this callback will belong to the group.




## method: Test.describe.skip
* since: v1.10

Declares a skipped test group, similarly to [`method: Test.describe#1`]. Tests in the skipped group are never run.

**Usage**

```js
test.describe.skip('skipped group', () => {
  test('example', async ({ page }) => {
    // This test will not run
  });
});
```

### param: Test.describe.skip.title
* since: v1.10
- `title` <[string]>

Group title.

### param: Test.describe.skip.callback
* since: v1.10
- `callback` <[function]>

A callback that is run immediately when calling [`method: Test.describe.skip`]. Any tests added in this callback will belong to the group, and will not be run.



## property: Test.expect
* since: v1.10
- type: <[Object]>

`expect` function can be used to create test assertions. Read more about [test assertions](../test-assertions.md).

**Usage**

```js
test('example', async ({ page }) => {
  await test.expect(page).toHaveTitle('Title');
});
```



## method: Test.extend
* since: v1.10
- returns: <[Test]>

Extends the `test` object by defining fixtures and/or options that can be used in the tests.

**Usage**

First define a fixture and/or an option.

```js tab=js-js title="my-test.js"
const base = require('@playwright/test');
const { TodoPage } = require('./todo-page');

// Extend basic test by providing a "defaultItem" option and a "todoPage" fixture.
exports.test = base.test.extend({
  // Define an option and provide a default value.
  // We can later override it in the config.
  defaultItem: ['Do stuff', { option: true }],

  // Define a fixture. Note that it can use built-in fixture "page"
  // and a new option "defaultItem".
  todoPage: async ({ page, defaultItem }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.addToDo(defaultItem);
    await use(todoPage);
    await todoPage.removeAll();
  },
});
```

```js tab=js-ts
import { test as base } from '@playwright/test';
import { TodoPage } from './todo-page';

export type Options = { defaultItem: string };

// Extend basic test by providing a "defaultItem" option and a "todoPage" fixture.
export const test = base.extend<Options & { todoPage: TodoPage }>({
  // Define an option and provide a default value.
  // We can later override it in the config.
  defaultItem: ['Do stuff', { option: true }],

  // Define a fixture. Note that it can use built-in fixture "page"
  // and a new option "defaultItem".
  todoPage: async ({ page, defaultItem }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.addToDo(defaultItem);
    await use(todoPage);
    await todoPage.removeAll();
  },
});
```

Then use the fixture in the test.

```js title="example.spec.ts"
import { test } from './my-test';

test('test 1', async ({ todoPage }) => {
  await todoPage.addToDo('my todo');
  // ...
});
```

Configure the option in config file.

```js tab=js-js title="playwright.config.ts"
// @ts-check

module.exports = defineConfig({
  projects: [
    {
      name: 'shopping',
      use: { defaultItem: 'Buy milk' },
    },
    {
      name: 'wellbeing',
      use: { defaultItem: 'Exercise!' },
    },
  ]
});
```

```js tab=js-ts title="playwright.config.ts"
import { defineConfig } from '@playwright/test';
import type { Options } from './my-test';

export default defineConfig<Options>({
  projects: [
    {
      name: 'shopping',
      use: { defaultItem: 'Buy milk' },
    },
    {
      name: 'wellbeing',
      use: { defaultItem: 'Exercise!' },
    },
  ]
});
```

Learn more about [fixtures](../test-fixtures.md) and [parametrizing tests](../test-parameterize.md).

### param: Test.extend.fixtures
* since: v1.10
- `fixtures` <[Object]>

An object containing fixtures and/or options. Learn more about [fixtures format](../test-fixtures.md).





## method: Test.fail#1
* since: v1.10

Unconditionally marks a test as "should fail". Playwright Test runs this test and ensures that it is actually failing. This is useful for documentation purposes to acknowledge that some functionality is broken until it is fixed.

**Usage**

```js
import { test, expect } from '@playwright/test';

test('not yet ready', async ({ page }) => {
  test.fail();
  // ...
});
```

## method: Test.fail#2
* since: v1.10

Conditionally mark a test as "should fail" with an optional description.

**Usage**

```js
import { test, expect } from '@playwright/test';

test('fail in WebKit', async ({ page, browserName }) => {
  test.fail(browserName === 'webkit', 'This feature is not implemented for Mac yet');
  // ...
});
```

### param: Test.fail#2.condition
* since: v1.10
- `condition` <[boolean]>

Test is marked as "should fail" when the condition is `true`.

### param: Test.fail#2.description
* since: v1.10
- `description` ?<[string]>

Optional description that will be reflected in a test report.


## method: Test.fail#3
* since: v1.10

Conditionally mark all tests in a file or [`method: Test.describe#1`] group as "should fail".

**Usage**

```js
import { test, expect } from '@playwright/test';

test.fail(({ browserName }) => browserName === 'webkit');

test('fail in WebKit 1', async ({ page }) => {
  // ...
});
test('fail in WebKit 2', async ({ page }) => {
  // ...
});
```

### param: Test.fail#3.condition
* since: v1.10
- `callback` <[function]\([Fixtures]\):[boolean]>

A function that returns whether to mark as "should fail", based on test fixtures. Test or tests are marked as "should fail" when the return value is `true`.

### param: Test.fail#3.description
* since: v1.10
- `description` ?<[string]>

Optional description that will be reflected in a test report.


## method: Test.fixme#1
* since: v1.10

Declares a test to be fixed, similarly to [`method: Test.(call)`]. This test will not be run.

**Usage**


```js
import { test, expect } from '@playwright/test';

test.fixme('test to be fixed', async ({ page }) => {
  // ...
});
```

### param: Test.fixme#1.title
* since: v1.10
- `title` <[string]>

Test title.

### param: Test.fixme#1.testFunction
* since: v1.10
- `testFunction` <[function]\([Fixtures], [TestInfo]\)>

Test function that takes one or two arguments: an object with fixtures and optional [TestInfo].



## method: Test.fixme#2
* since: v1.10

Mark a test as "fixme", with the intention to fix it. Test is immediately aborted when you call [`method: Test.fixme#2`].

**Usage**

```js
import { test, expect } from '@playwright/test';

test('test to be fixed', async ({ page }) => {
  test.fixme();
  // ...
});
```

Mark all tests in a file or [`method: Test.describe#1`] group as "fixme".

```js
import { test, expect } from '@playwright/test';

test.fixme();

test('test to be fixed 1', async ({ page }) => {
  // ...
});
test('test to be fixed 2', async ({ page }) => {
  // ...
});
```


## method: Test.fixme#3
* since: v1.10

Conditionally mark a test as "fixme" with an optional description.

**Usage**

```js
import { test, expect } from '@playwright/test';

test('broken in WebKit', async ({ page, browserName }) => {
  test.fixme(browserName === 'webkit', 'This feature is not implemented on Mac yet');
  // ...
});
```


### param: Test.fixme#3.condition
* since: v1.10
- `condition` <[boolean]>

Test is marked as "fixme" when the condition is `true`.

### param: Test.fixme#3.description
* since: v1.10
- `description` ?<[string]>

Optional description that will be reflected in a test report.




## method: Test.fixme#4
* since: v1.10

Conditionally mark all tests in a file or [`method: Test.describe#1`] group as "fixme".

**Usage**

```js
import { test, expect } from '@playwright/test';

test.fixme(({ browserName }) => browserName === 'webkit');

test('broken in WebKit 1', async ({ page }) => {
  // ...
});
test('broken in WebKit 2', async ({ page }) => {
  // ...
});
```


### param: Test.fixme#4.condition
* since: v1.10
- `callback` <[function]\([Fixtures]\):[boolean]>

A function that returns whether to mark as "fixme", based on test fixtures. Test or tests are marked as "fixme" when the return value is `true`.

### param: Test.fixme#4.description
* since: v1.10
- `description` ?<[string]>

Optional description that will be reflected in a test report.


## method: Test.info
* since: v1.10
- returns: <[TestInfo]>

Returns information about the currently running test. This method can only be called during the test execution, otherwise it throws.

**Usage**

```js
test('example test', async ({ page }) => {
  // ...
  await test.info().attach('screenshot', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});
```


## method: Test.only
* since: v1.10

Declares a focused test. If there are some focused tests or suites, all of them will be run but nothing else.

**Usage**

```js
test.only('focus this test', async ({ page }) => {
  // Run only focused tests in the entire project.
});
```

### param: Test.only.title
* since: v1.10
- `title` <[string]>

Test title.

### param: Test.only.testFunction
* since: v1.10
- `testFunction` <[function]\([Fixtures], [TestInfo]\)>

Test function that takes one or two arguments: an object with fixtures and optional [TestInfo].


## method: Test.setTimeout
* since: v1.10

Changes the timeout for the test. Zero means no timeout. Learn more about [various timeouts](../test-timeouts.md).

Timeout for the currently running test is available through [`property: TestInfo.timeout`].

**Usage**

* Changing test timeout.

  ```js
  test('very slow test', async ({ page }) => {
    test.setTimeout(120000);
    // ...
  });
  ```

* Changing timeout from a slow `beforeEach` or `afterEach` hook. Note that this affects the test timeout that is shared with `beforeEach`/`afterEach` hooks.

  ```js
  test.beforeEach(async ({ page }, testInfo) => {
    // Extend timeout for all tests running this hook by 30 seconds.
    test.setTimeout(testInfo.timeout + 30000);
  });
  ```

* Changing timeout for a `beforeAll` or `afterAll` hook. Note this affects the hook's timeout, not the test timeout.

  ```js
  test.beforeAll(async () => {
    // Set timeout for this hook.
    test.setTimeout(60000);
  });
  ```

* Changing timeout for all tests in a [`method: Test.describe#1`] group.

  ```js
  test.describe('group', () => {
    // Applies to all tests in this group.
    test.describe.configure({ timeout: 60000 });

    test('test one', async () => { /* ... */ });
    test('test two', async () => { /* ... */ });
    test('test three', async () => { /* ... */ });
  });
  ```

### param: Test.setTimeout.timeout
* since: v1.10
- `timeout` <[int]>

Timeout in milliseconds.



## method: Test.skip#1
* since: v1.10

Declares a skipped test, similarly to [`method: Test.(call)`]. Skipped test is never run.

**Usage**

```js
import { test, expect } from '@playwright/test';

test.skip('broken test', async ({ page }) => {
  // ...
});
```

### param: Test.skip#1.title
* since: v1.10
- `title` <[string]>

Test title.

### param: Test.skip#1.testFunction
* since: v1.10
- `testFunction` <[function]\([Fixtures], [TestInfo]\)>

Test function that takes one or two arguments: an object with fixtures and optional [TestInfo].



## method: Test.skip#2
* since: v1.10

Unconditionally skip a test. Test is immediately aborted when you call [`method: Test.skip#2`].

**Usage**

```js
import { test, expect } from '@playwright/test';

test('skipped test', async ({ page }) => {
  test.skip();
  // ...
});
```

Unconditionally skip all tests in a file or [`method: Test.describe#1`] group:

```js
import { test, expect } from '@playwright/test';

test.skip();

test('skipped test 1', async ({ page }) => {
  // ...
});
test('skipped test 2', async ({ page }) => {
  // ...
});
```


## method: Test.skip#3
* since: v1.10

Conditionally skip a test with an optional description.

**Usage**

```js
import { test, expect } from '@playwright/test';

test('skip in WebKit', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'This feature is not implemented for Mac');
  // ...
});
```

Skip from [`method: Test.beforeEach#1`] hook:

```js
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  test.skip(process.env.APP_VERSION === 'v1', 'There are no settings in v1');
  await page.goto('/settings');
});
```

### param: Test.skip#3.condition
* since: v1.10
- `condition` <[boolean]>

A skip condition. Test is skipped when the condition is `true`.

### param: Test.skip#3.description
* since: v1.10
- `description` ?<[void]|[string]>

Optional description that will be reflected in a test report.




## method: Test.skip#4
* since: v1.10

Conditionally skips all tests in a file or [`method: Test.describe#1`] group.

**Usage**

```js
import { test, expect } from '@playwright/test';

test.skip(({ browserName }) => browserName === 'webkit');

test('skip in WebKit 1', async ({ page }) => {
  // ...
});
test('skip in WebKit 2', async ({ page }) => {
  // ...
});
```


### param: Test.skip#4.condition
* since: v1.10
- `callback` <[function]\([Fixtures]\):[boolean]>

A function that returns whether to skip, based on test fixtures. Test or tests are skipped when the return value is `true`.

### param: Test.skip#4.description
* since: v1.10
- `description` ?<[string]>

Optional description that will be reflected in a test report.



## method: Test.slow#1
* since: v1.10

Unconditionally marks a test as "slow". Slow test will be given triple the default timeout.

**Details**

[`method: Test.slow#1`] cannot be used in a `beforeAll` or `afterAll` hook. Use [`method: Test.setTimeout`] instead.

**Usage**

```js
import { test, expect } from '@playwright/test';

test('slow test', async ({ page }) => {
  test.slow();
  // ...
});
```

## method: Test.slow#2
* since: v1.10

Conditionally mark a test as "slow" with an optional description. Slow test will be given triple the default timeout.

**Usage**

```js
import { test, expect } from '@playwright/test';

test('slow in WebKit', async ({ page, browserName }) => {
  test.slow(browserName === 'webkit', 'This feature is slow on Mac');
  // ...
});
```

### param: Test.slow#2.condition
* since: v1.10
- `condition` <[boolean]>

Test is marked as "slow" when the condition is `true`.

### param: Test.slow#2.description
* since: v1.10
- `description` ?<[string]>

Optional description that will be reflected in a test report.


## method: Test.slow#3
* since: v1.10

Conditionally mark all tests in a file or [`method: Test.describe#1`] group as "slow". Slow tests will be given triple the default timeout.

**Usage**

```js
import { test, expect } from '@playwright/test';

test.slow(({ browserName }) => browserName === 'webkit');

test('slow in WebKit 1', async ({ page }) => {
  // ...
});
test('fail in WebKit 2', async ({ page }) => {
  // ...
});
```

### param: Test.slow#3.condition
* since: v1.10
- `callback` <[function]\([Fixtures]\):[boolean]>

A function that returns whether to mark as "slow", based on test fixtures. Test or tests are marked as "slow" when the return value is `true`.

### param: Test.slow#3.description
* since: v1.10
- `description` ?<[string]>

Optional description that will be reflected in a test report.


## async method: Test.step
* since: v1.10
- returns: <[any]>

Declares a test step that is shown in the report.

**Usage**

```js
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await test.step('Log in', async () => {
    // ...
  });

  await test.step('Outer step', async () => {
    // ...
    // You can nest steps inside each other.
    await test.step('Inner step', async () => {
      // ...
    });
  });
});
```

**Details**

The method returns the value returned by the step callback.

```js
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  const user = await test.step('Log in', async () => {
    // ...
    return 'john';
  });
  expect(user).toBe('john');
});
```

**Decorator**

You can use TypeScript method decorators to turn a method into a step.
Each call to the decorated method will show up as a step in the report.

```js
function step(target: Function, context: ClassMethodDecoratorContext) {
  return function replacementMethod(...args: any) {
    const name = this.constructor.name + '.' + (context.name as string);
    return test.step(name, async () => {
      return await target.call(this, ...args);
    });
  };
}

class LoginPage {
  constructor(readonly page: Page) {}

  @step
  async login() {
    const account = { username: 'Alice', password: 's3cr3t' };
    await this.page.getByLabel('Username or email address').fill(account.username);
    await this.page.getByLabel('Password').fill(account.password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
    await expect(this.page.getByRole('button', { name: 'View profile and more' })).toBeVisible();
  }
}

test('example', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login();
});
```

**Boxing**

When something inside a step fails, you would usually see the error pointing to the exact action that failed. For example, consider the following login step:

```js
async function login(page) {
  await test.step('login', async () => {
    const account = { username: 'Alice', password: 's3cr3t' };
    await page.getByLabel('Username or email address').fill(account.username);
    await page.getByLabel('Password').fill(account.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();
  });
}

test('example', async ({ page }) => {
  await page.goto('https://github.com/login');
  await login(page);
});
```

```txt
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  ... error details omitted ...

   8 |     await page.getByRole('button', { name: 'Sign in' }).click();
>  9 |     await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();
     |                                                                               ^
  10 |   });
```

As we see above, the test may fail with an error pointing inside the step. If you would like the error to highlight the "login" step instead of its internals, use the `box` option. An error inside a boxed step points to the step call site.

```js
async function login(page) {
  await test.step('login', async () => {
    // ...
  }, { box: true });  // Note the "box" option here.
}
```

```txt
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  ... error details omitted ...

  14 |   await page.goto('https://github.com/login');
> 15 |   await login(page);
     |         ^
  16 | });
```

You can also create a TypeScript decorator for a boxed step, similar to a regular step decorator above:

```js
function boxedStep(target: Function, context: ClassMethodDecoratorContext) {
  return function replacementMethod(...args: any) {
    const name = this.constructor.name + '.' + (context.name as string);
    return test.step(name, async () => {
      return await target.call(this, ...args);
    }, { box: true });  // Note the "box" option here.
  };
}

class LoginPage {
  constructor(readonly page: Page) {}

  @boxedStep
  async login() {
    // ....
  }
}

test('example', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login();  // <-- Error will be reported on this line.
});
```

### param: Test.step.title
* since: v1.10
- `title` <[string]>

Step name.


### param: Test.step.body
* since: v1.10
- `body` <[function]\(\):[Promise]<[any]>>

Step body.

### option: Test.step.box
* since: v1.39
- `box` <boolean>

Whether to box the step in the report. Defaults to `false`. When the step is boxed, errors thrown from the step internals point to the step call site. See below for more details.

## method: Test.use
* since: v1.10

Specifies options or fixtures to use in a single test file or a [`method: Test.describe#1`] group. Most useful to set an option, for example set `locale` to configure `context` fixture.

**Usage**

```js
import { test, expect } from '@playwright/test';

test.use({ locale: 'en-US' });

test('test with locale', async ({ page }) => {
  // Default context and page have locale as specified
});
```

**Details**

`test.use` can be called either in the global scope or inside `test.describe`. It is an error to call it within `beforeEach` or `beforeAll`.

It is also possible to override a fixture by providing a function.

```js
import { test, expect } from '@playwright/test';

test.use({
  locale: async ({}, use) => {
    // Read locale from some configuration file.
    const locale = await fs.promises.readFile('test-locale', 'utf-8');
    await use(locale);
  },
});

test('test with locale', async ({ page }) => {
  // Default context and page have locale as specified
});
```

### param: Test.use.fixtures
* since: v1.10
- `options` <[TestOptions]>

An object with local options.


