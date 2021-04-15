# Warning on using deprecated modules (no-use-deprecated-modules)

We do not want to use deprecated modules to avoid any possible errors in the future.

## Rule Details

This rule is aimed at reporting on imports from deprecated modules.

Examples of **incorrect** code for this rule:

*These packages are deprecated:*

```js
import moment from 'moment';

import request from 'request';
```

Examples of **correct** code for this rule:

*These packages are **not** deprecated:*

```js
import { createSlice } from '@reduxjs/toolkit';

import { FunctionComponent } from 'react';
```
