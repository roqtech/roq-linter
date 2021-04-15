# Error while using HttpStatus, should not import alias (http-exception-should-not-imported-alias)

Using HttpStatus without alias

## Rule Details

Such HttpStatus must haven't alias

Examples of **incorrect** code for this rule

```js
import { HttpStatus as Hp } from '@nestjs/common'
```

Examples of **correct** code for this rule

```js
import { HttpStatus } from '@nestjs/common'
```
