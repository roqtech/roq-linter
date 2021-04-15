# Filenames should look like {any-name}{any.type}.extension (no-invalid-filename-pattern)

There is a pattern that defines how our filenames should be structured. It is required that the files do adhere to them. 

## Rule Details

This rule expects that each file should be named like {any-name}{any-type}.extension,  where the name part should be separted using 'hyphens' and type part should be separated using 'dots'. A file type is generally derived by the directory it resides in (but may differ in some cases and some files may also **not** have types at all, look at 'filename-suffix-mismatch' rule for all variations).

Also files at the specified paths need not adhere to this rule:
 
      1) frontend/src/pages/api

Examples of **incorrect** filenames that trigger this rule:

```js
/*eslint no-invalid-filename-pattern: "error"*/
backend/src/{mod-name}/dtos/{mod-name}.login-new.dto.ts
backend/src/{mod-name}/entities/{mod-name}-log.on-fb.entity.ts

```

Examples of **correct** filenames that do not trigger this rule:

```js
/*eslint no-invalid-filename-pattern: "warn"*/
backend/src/{mod-name}/dtos/{mod-name}-login-new.dto.ts
backend/src/{mod-name}/entities/{mod-name}-log-on-fb.entity.ts
```
