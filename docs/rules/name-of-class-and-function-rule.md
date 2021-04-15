# Name of class should match file in PascalCase, name of exported function should match file in camelCase (name-of-class-rule)

Name of class should match file in PascalCase, name of exported function should match file in camelCase.

## Rule Details

This rule will report all class and function names which are not matched with file names; However mappers in backend modules follow a different exporting scheme of functions, they are prefixed by map and instead of being suffixed by "Mapper" they are suffixed by "ToModel" 

Examples of **incorrect** code for this rule:

```js
any-class.ts
export class SomeClass {}

any.component.ts
export SomeComp {}

any.func.ts
export function SomeFunc() {}

some-func.ts
export function AnyFunc() {}

```

Examples of **correct** code for this rule:

```js
something-class.ts
export class SomethingClass {}

some.component.ts
export SomeComponent {}

any.func.ts
export function anyFunc() {}

some-func.ts
export function someFunc() {}

```
