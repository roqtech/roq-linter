# React-hooks should follow the defined conventions (no-invalid-hook-resource)

The rule applies to react-hooks and hence this is a frontend specific rule.

## Rule Details

This rule expects that filenames should be prefixed with "use" and the exported constant name matches the name of the file. This rule applies to files matching the following pattern:

>- frontend/src/common/roq-hooks/use-{hook-name}/use-{hook-name}.hook.ts(x)
>- frontend/src/components/{component-name}/hooks/

Examples of **incorrect** code that trigger this rule:

```js
/* eslint : no-invalid-hook-resource "error"
For file at path /frontend/src/common/roq-hooks/use-auth/use-auth.hook.ts
*/
export const useAuth = ()=>{ /* definition */ }
```

Examples of **correct** code that does not trigger this rule:

```js
/*eslint : no-invalid-hook-resource "error"
For file at path /frontend/src/common/roq-hooks/use-auth/use-auth.hook.ts
*/
export const useAuthHook = ()=>{ /* definition */ }
```
