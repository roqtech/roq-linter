# Exports should follow conventions (exports-should-follow-conventions)

Wildcard exports are not allowed, use named exports instead. Also default exports are not allowed anywhere except in frontend slices and pages. Also all types/interfaces should be exported like "export type {...} from ..." 

## Rule Details

This rule will restrict wildcard exports, also default exports in all non frontend slices and pages. And export should be of "type" kind for all interface exports.

Examples of **incorrect** code for this rule:

```js
// file in some backend module
export default something

export { SomeInterface } from 'src/moduleName/interfaces/some.interface.ts'

export * from 'module'

```

Examples of **correct** code for this rule:

```js
// file in some backend module

export const anything

export type { SomeInterface } from 'src/moduleName/interfaces/some.interface.ts'


export { SomeClass } from 'module'
```
