# Resolver Methods should necessarily call methods of service (mutation-calls-service-method)

The rule applies to all Mutations in module resolvers and it is a backend specific rule.

## Rule Details

This rule expects that all mutations in a module should be calling a method of service. This rule applies to files matching the following pattern (except index.ts):

>- backend/src/{module}/resolvers/{filename}.ts

Examples of **incorrect** code that trigger this rule:

```js
/* eslint : mutation-calls-service-method "error"
For file at path backend/src/auth/resolvers/auth.resolver.ts
*/
import { AuthService } from 'src/auth/services';
@Resolver(() => String)
export class AuthResolver {
  constructor() {
  }
  @Mutation(() => String)
  async login(): string {
    return 'loggedIn';
  }

```

Examples of **correct** code that does not trigger this rule:

```js
/* eslint : mutation-calls-service-method "error"
For file at path backend/src/auth/resolvers/auth.resolver.ts
*/

import { AuthService } from 'src/auth/services';

@Resolver(() => String)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {
  }
  @Mutation(() => String)
  async login(): String {
    // A method of serbice is called below.
    return this.authService.login(); 
  }
}
```
