# Error on exporting not interface from *interfaces* folder

Only interfaces can be exported from files in *interfaces* folder.

## Rule Details

This rule will throw error if such files: *"backend/src/{module}/interfaces/{filename}.ts"* export not interface

Examples of **incorrect** code for this rule:

```js
// file in "interfaces" folder
export type 
JwtTokenType = string;
```

Examples of **correct** code for this rule:

```js
// file in "interfaces" folder
export interface 
AuthenticatedRequestInterface 
{}
```
