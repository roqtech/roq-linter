# Error while exporting class from "repository" file without "@EntityRepository" decorator (repository-correct-export-annotation)

Export class from "repository" file without appropriate decorator not allowed.

## Rule Details

This rule will throw error exporting such classes without "@EntityRepository" decorator.

Examples of **incorrect** code for this rule (in *anyName.repository.ts* file):

```js
@ObjectType()
export class AnyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
```

Examples of **correct** code for this rule (in *anyName.repository.ts* file):

```js
@EntityRepository()
export class AnyTypeRepository {
}
```
