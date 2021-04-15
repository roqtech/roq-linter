# Disallow comments without content (no-comments-with-no-content)

Empty comments without content should not be present in codebase.

## Rule Details

This rule will report all empty comments.

Examples of **incorrect** code for this rule:

```js
/* */
const something = 10;
//
if (obj != undefined) { }
/* */
```

Examples of **correct** code for this rule:

```js
/* Used for something */
const something = 10;
// Checking if obj is valid
if (obj != undefined) { }
```
