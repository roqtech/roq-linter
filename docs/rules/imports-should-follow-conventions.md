# Disallow import with relative path and from index (imports-should-follow-conventions)

Use absolute path instead of relative and omit import from index.

## Rule Details

This rule will report all imports from relative path and from index.

Examples of **incorrect** code for this rule:

```js
import SomeComponent from "../components"

import Something from 'layout/index'
```

Examples of **correct** code for this rule:

```js

import SomeComponent from "/common/components"

import Something from 'layout'

```
