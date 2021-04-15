# Error while exporting class from "module" file without "@Module" decorator (exports-should-module-decorator)

Export class from "module" file without appropriate decorator not allowed.

## Rule Details

This rule will throw error exporting such classes without "@Module" decorator.

Examples of **incorrect** code for this rule (in *anyName.module.ts* file):

```js
@Entity({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
```

Examples of **correct** code for this rule (in *anyName.module.ts* file):

```js
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
```
