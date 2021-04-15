# Resolver Methods should be marked with allowed decorators (no-disallowed-method-decorators)

The rule applies to all module resolvers and it is a backend specific rule.

## Rule Details

This rule expects that all resolver class methods should be marked with either 'ResolveField', 'Query' or 'Mutation'. This rule applies to files matching the following pattern:

>- backend/src/{module}/resolvers/{filename}.ts

Examples of **incorrect** code that trigger this rule:

```js
/* eslint : no-disallowed-method-decorators "error"
For file at path backend/src/auth/resolvers/auth.resolver.ts
*/
@Resolver(() => String)
export class AuthResolver {
  constructor() {
  }
  // Missing needed decorator
  async login(@Args('input') input: AuthLoginDto, @LoginMeta() meta: LoginMetaDto): Promise<AuthTokenModel> {
    return this.authService.login(input, meta);
  }
```

Examples of **correct** code that does not trigger this rule:

```js
/* eslint : no-disallowed-method-decorators "error"
For file at path backend/src/auth/resolvers/auth.resolver.ts
*/
@Resolver(() => String)
export class AuthResolver {
  constructor() {
  }
  @Mutation(() => AuthTokenModel)
  async login(@Args('input') input: AuthLoginDto, @LoginMeta() meta: LoginMetaDto): Promise<AuthTokenModel> {
    return this.authService.login(input, meta);
  }
```
