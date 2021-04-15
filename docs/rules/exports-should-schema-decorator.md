# Error while exporting class from "schema" file without "@Schema" decorator (exports-should-schema-decorator)

Export class from "schema" file without appropriate decorator not allowed.

## Rule Details

This rule will throw error exporting such classes without "@Schema" decorator.

Examples of **incorrect** code for this rule (in *anyName.schema.ts* file):

```js
@ObjectType()
export class AnySchema {}
```

Examples of **correct** code for this rule (in *anyName.schema.ts* file):


```js
@Schema()
export class AnySchema {}
```
