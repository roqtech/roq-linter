# Pages should follow the defined conventions (no-invalid-page-resource)

Default page exports should be named like [{DirectoryName}Page]
The rule applies to pages and hence this is a frontend specific rule.

## Rule Details

This rule expects that the said files should have exactly one default export and it should be named the same as the directoryName (pascalCased) and suffixed with "Page". This rule applies to files matching the following pattern:

>- frontend/src/pages/{page-name}/.*/index.tsx

Examples of **incorrect** code that trigger this rule:

```js
/* eslint : no-invalid-page-resource "error"
For file at path /frontend/src/pages/account-activate/index.tsx
*/

import { NextPage } from 'next';
const AccountActivatePage: NextPage = () => (
/* Body */
);
export default Account;
```

Examples of **correct** code that does not trigger this rule:

```js
/* eslint : no-invalid-page-resource "error"
For file at path /frontend/src/pages/account-activate/index.tsx
*/

import { NextPage } from 'next';
const AccountActivatePage: NextPage = () => (
/* Body */
);
export default AccountActivatePage;
```
