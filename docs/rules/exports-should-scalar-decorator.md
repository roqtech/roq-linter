# Error while exporting class from "scalar" file without "@Scalar" decorator (exports-should-scalar-decorator)

Export class from "scalar" file without appropriate decorator not allowed.

## Rule Details

This rule will throw error exporting such classes without "@Scalar" decorator.

Examples of **incorrect** code for this rule (in *anyName.object.scalar.ts* file):

```js
@ObjectType()
export class AnyObjectScalar {}
```

Examples of **correct** code for this rule (in *anyName.object.scalar.ts* file):


```js
@Scalar()
export class AnyScalar {}
```
