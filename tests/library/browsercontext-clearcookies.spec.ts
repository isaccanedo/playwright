/**
 * Copyright 2018 Google Inc. All rights reserved.
 * Modifications copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { contextTest as it, expect } from '../config/browserTest';

it('should clear cookies', async ({ context, page, server }) => {
  await page.goto(server.EMPTY_PAGE);
  await context.addCookies([{
    url: server.EMPTY_PAGE,
    name: 'cookie1',
    value: '1'
  }]);
  expect(await page.evaluate('document.cookie')).toBe('cookie1=1');
  await context.clearCookies();
  expect(await context.cookies()).toEqual([]);
  await page.reload();
  expect(await page.evaluate('document.cookie')).toBe('');
});

it('should isolate cookies when clearing', async ({ context, server, browser }) => {
  const anotherContext = await browser.newContext();
  await context.addCookies([{ url: server.EMPTY_PAGE, name: 'page1cookie', value: 'page1value' }]);
  await anotherContext.addCookies([{ url: server.EMPTY_PAGE, name: 'page2cookie', value: 'page2value' }]);

  expect((await context.cookies()).length).toBe(1);
  expect((await anotherContext.cookies()).length).toBe(1);

  await context.clearCookies();
  expect((await context.cookies()).length).toBe(0);
  expect((await anotherContext.cookies()).length).toBe(1);

  await anotherContext.clearCookies();
  expect((await context.cookies()).length).toBe(0);
  expect((await anotherContext.cookies()).length).toBe(0);
  await anotherContext.close();
});
