# Error while exporting class from "entity" file without "@Entity" decorator (exports-should-entity-decorator)

Export class from "entity" file without appropriate decorator not allowed.

## Rule Details

This rule will throw error exporting such classes without "@Entity" decorator.

Examples of **incorrect** code for this rule (in *anyName.entity.ts* file):

```js
@ObjectType()
export class AnyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
```

Examples of **correct** code for this rule (in *anyName.entity.ts* file):


```js
@Entity()
export class AnyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
```
