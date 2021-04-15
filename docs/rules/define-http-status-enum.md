# Error while using HttpException, second parameter skipped or not HttpStatus enum (define-http-status-enum)

Using HttpException without second parameter or second parameter not HttpStatus enum

## Rule Details

Such HttpException must have HttpStatus enum in second parameter

Examples of **incorrect** code for this rule:

```js
throw new HttpException('The link is not valid')
```

Examples of **correct** code for this rule:

```js
throw new HttpException('The link is not valid', HttpStatus.UNPROCESSABLE_ENTITY)
```
