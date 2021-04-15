# Warning if *layouts* directory contains not *layout* files. Warning if *layout* file exports not *layout* component

*Layout* directory can contain only *layout* files which can export only *layout* components

## Rule Details

This rule will throw warning if *layouts* directory contains not *layout* files.

Also, it will throw warning if *layout* file exports not *layout* component.

Examples of **incorrect** code for this rule:

```js
// in "layouts" folder:
// file name - "auth.ts" -> Warning!
export const AuthLayout: FunctionComponent<> = () => {}
```

```js
// in "layouts" folder:
// file name - "auth.layout.ts" -> no warning
export const Auth: FunctionComponent<> = () => {} 
// component name -> Warning!
```

Examples of **correct** code for this rule:

```js
// in "layouts" folder:
// file name - "auth.layout.ts"
export const AuthLayout: FunctionComponent<> = () => {}
// file name and component name are correct
```
