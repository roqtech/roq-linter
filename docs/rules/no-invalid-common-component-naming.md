# Common Components filenames should follow the defined conventions (no-invalid-common-component-naming)

The rule applies to common components and hence this is a frontend specific rule.

## Rule Details

This rule expects that filenames should be prefixed with the component-name(the parent directory name) (a list of directory names containing related components can also be supplied as options which will be exempted from this check of the rule). This rule also checks that the filename does not contain any type (dot separated entity). 

The rule applies to files matching the following pattern:

>- frontend/src/common/roq-ui/{any-component}/{any-component}-{sub-view}.tsx

Examples of **incorrect** filenames that trigger this rule:

```js
/* eslint : no-invalid-common-component-naming "error"*/
frontend/src/common/roq-ui/time-picker/picker-item.tsx
frontend/src/common/roq-ui/table/map-field-to-component.mapper.tsx
```

Examples of **correct** filenames that do not trigger this rule:

```js
/* eslint : no-invalid-common-component-naming "error"*/
frontend/src/common/roq-ui/time-picker/time-picker-item.tsx
frontend/src/common/roq-ui/table/table-map-field-to-component-mapper.tsx
```
