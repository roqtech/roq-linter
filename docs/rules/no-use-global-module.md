# Warning on importing global nestjs modules (no-use-global-module)

We do not want to import global nestjs modules, as it is extraneous as they are available in the global scope.

## Rule Details

This rule is aimed at reporting imports of global module by other modules (except for root module).


## Options

This rule takes one argument, which is an array of string. This array consists a list of global nestjs modules. However, if you forget to add in some global modules to this array, this rule raises a warning to point out that as well.      

Examples of **incorrect** import of global nestjs modules for the `['ConfigModule']` option:

```js
/*eslint no-use-global-module: "warn"*/
// For file at path backend/src/sample/sample.module.ts
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule],
  ..
})
export class SampleModule {}
```

Examples of **correct** directory name for the `['ConfigModule']` option:

```js
/*eslint no-use-global-module: "warn"*/
// For file at path backend/src/sample/sample.module.ts
@Module({
  ..
})
export class SampleModule {}
```
