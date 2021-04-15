# Filenames can contain only certain characters (no-invalid-char-in-filename)

For having a consistency in filenaming use of only certain characters are allowed. It is required that the filenames do adhere to them. 

## Rule Details

This rule expects that each file is named using only a few allowed characters (lowercased english alphabets, digits, hyphens and dots).

Also files at the specified paths need not adhere to this rule:
 
      1) frontend/src/pages/api

Examples of **incorrect** filenames that trigger this rule:

```js
/*eslint no-invalid-char-in-filename: "error"*/
backend/src/{mod-name}/dtos/{mod-name}-Login-new.dto.ts
backend/src/{mod-name}/entities/{mod-name}-login-F_b.entity.ts
frontend/src/shared/dataInfo.js

```

Examples of **correct** filenames that do not trigger this rule:

```js
/*eslint no-invalid-char-in-filename: "error"*/
backend/src/{mod-name}/dtos/{mod-name}-Login-new.dto.ts
backend/src/{mod-name}/entities/{mod-name}-login-fb.entity.ts
frontend/src/shared/data-info.js
```
