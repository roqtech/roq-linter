# Certain directories must necessarily have a index file (dir-contains-index)

As a best practice we want that certain resources are exported via index files. 

## Rule Details

This rule expects that each directory must have a index.ts(x) so that all the exports related to this directory are made via the index file, a few directories that are exception to this rule are:

      1) Files in root directories (backend/src, frontend/src, backend/tests).
      2) frontend/src/common/interfaces/
      3) frontend/src/common/roq-hooks/{hook-name}
      4) frontend/src/configuration/
      5) frontend/src/layouts/{layout-name}
      6) frontend/src/shared/
      7) frontend/src/styles/
      8) frontend/src/utils/
      9) backend/src/config/

Examples of **incorrect** directory structure that trigger this rule:

```
/*eslint dir-contains-index: "error"*/
backend/src/auth/dtos
├── auth-account-activate.dto.ts
├── auth-account-activate-provider-link.dto.ts
└── login-meta.dto.ts
```


Examples of **correct** directory structure that do not trigger this rule:

```
/*eslint dir-contains-index: "error"*/
backend/src/auth/dtos
├── auth-account-activate.dto.ts
├── auth-account-activate-provider-link.dto.ts
└── login-meta.dto.ts
└── index.ts
```
