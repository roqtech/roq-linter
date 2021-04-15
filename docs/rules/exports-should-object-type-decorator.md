# Error while exporting class from "model" file without "@ObjectType" decorator (exports-should-object-type-decorator)

Export class from "model" file without appropriate decorator not allowed.

## Rule Details

This rule will throw error exporting such classes without "@ObjectType" decorator.

Examples of **incorrect** code for this rule (in *anyName.model.ts* file):

```js
@Entity()
export class AnyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
```

Examples of **correct** code for this rule (in *anyName.model.ts* file):

```js
@ObjectType()
export class AnyEntity {
  @Field()
  accessToken: string;
}
```
