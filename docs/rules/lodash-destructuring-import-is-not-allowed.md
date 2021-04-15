# Lodash destructuring import is not allowed (lodash-destructuring-import-is-not-allowed)

Destructuring import increases application size, we should use direct default import of lodash modules and functions

## Rule Details

This rule will check lodash imports and report all destructuring import.

Examples of **incorrect** code for this rule:

```js
import lodash from "lodash"

import { merge } from "lodash"
```

Examples of **correct** code for this rule:

```js

import merge from "library/merge"

```
