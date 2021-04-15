# Error while using HttpException, should not import alias (http-exception-should-not-imported-alias)

Using HttpException without alias

## Rule Details

Such HttpException must haven't alias

Examples of **incorrect** code for this rule

```js
import { HttpException as Hp } from '@nestjs/common'
```

Examples of **correct** code for this rule

```js
import { HttpException } from '@nestjs/common'
```
