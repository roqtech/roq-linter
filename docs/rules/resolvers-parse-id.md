# With ID must use ParseUUIDPipe

Use ParseUUIDPipe when used an ID

## Rule Details

This rule expects that each resolver file when received an ID then must use ParseUUIDPipe

Examples of **incorrect** case:

```js
export class UserResolver {
  @Query(() => UserModel)
  async user(@Args({ name: 'id', type: () => String }) id: string): Promise<UserModel> {}
}
```

Examples of **correct** case:

```js
export class UserResolver {
  @Query(() => UserModel)
  async user(@Args({ name: 'id', type: () => String }, ParseUUIDPipe) id: string): Promise<UserModel> {}
}
```
