# Filenames must end with (.parentDirectoryName)  (filename-suffix-mismatch)

There is a pattern that defines how our filenames should end (or suffixed). It is required that the files are suffixed in the said manner. 

## Rule Details

This rule expects that each file(except index.ts(x)) should be appended with a dot(.)+parentDirectoryName(lowercased, dot separated and in their singular form) and everything else should be a part of the filename. Although there our some exceptional suffixes as well, which are also considered by this rule, they are:

      1) Files in root of backendModules should have a suffix "module".
      2) React-hooks should have a suffix "hook".
      3) Frontend layouts should have a suffix "layout".
      4) Frontend views should have a suffix "view".
      5) Dtos allow both "arg-type" and "dto" as suffix.

Also files at the specified paths need not to adhere to this rule:
 
      1) frontend/src/slices/
      2) frontend/src/styles/
      3) frontend/src/utils/
      4) frontend/src/shared/
      5) frontend/src/pages/
      6) frontend/src/common/roq-ui/
      7) frontend/src/configuration/
      8) backend/src/config/
      9) Root directories: backend/src/ & frontend/src/

Examples of **incorrect** filenames that trigger this rule:

```js
/*eslint filename-suffix-mismatch: "error"*/
backend/src/{mod-name}/dtos/{mod-name}-login.create.dto.ts
backend/src/{mod-name}/entities/{mod-name}-login.ts
frontend/src/layouts/{layout-name}/{layout-name}.ts

```

Examples of **correct** filenames that do not trigger this rule:

```js
/*eslint filename-suffix-mismatch: "warn"*/
backend/src/{mod-name}/dtos/{mod-name}-login-create.dto.ts
backend/src/{mod-name}/entities/{mod-name}-login.entity.ts
frontend/src/layouts/{layout-name}/{layout-name}.layout.ts
```
