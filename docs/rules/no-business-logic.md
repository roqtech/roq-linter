# Error while using business logic in such files (no-business-logic):

We do not need any business logic (if, for, while, switch - statements) in such files like DTOs, Models, Interfaces, Entities .

## Rule Details

This rule is aimed to throw error on usage of business logic in these files.

Examples of **incorrect** code for this rule:

```js
@InputType()
export class anyDto {
  @Field()
  @IsString()
  anyValue: string;
}

const testArray = [1, 2, 3]
for(const testVar of testArray) {
  console.log(testVar)
}

```

Examples of **correct** code for this rule:


```js
@InputType()
export class anyDto {
  @Field()
  @IsString()
  anyValue: string;
}
```
