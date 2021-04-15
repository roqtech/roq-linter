# Disallow in-line eslint config (no-eslint-disable)

It is considered a best practice to stick to the project's global eslint configuration.

## Rule Details

This rule is aimed at reporting any kind of disabling of eslint config using inline configs.

Examples of **incorrect** code for this rule:

```js
/*eslint no-eslint-disable: "warn"*/
const x=10;
const text = "testText";
// eslint-disable eqeqeq
if (x == 42) { }

if ("" == text) { }
// eslint-enable eqeqeq

if (obj.getStuff() != undefined) { }
```

Examples of **correct** code for this rule:

```js
/*eslint no-eslint-disable: "warn"*/

const x=10;
const text = "testText";

if (x == 42) { }

if ("" == text) { }

if (obj.getStuff() != undefined) { }
```

## When Not To Use It

If you don't want to enforce a consistently styled codebase, then it's safe to disable this rule.
