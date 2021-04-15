# Files should only have a single enum definition (exactly-one-enum-definition)

The rule applies to enum and makes sure only a single enum is defined. This is a backend specific rule.

## Rule Details

This rule expects that exactly a single enum is defined and exported in each file. We suggest that each enum should be defined in it's own independent file. This rule applies to files matching the following pattern:

> backend/src/{module}/enums/{filename}.ts

Examples of **incorrect** code that trigger this rule:

```js
/*eslint : exactly-one-enum-definition "error"*/
import { registerEnumType } from '@nestjs/graphql';
export enum UserLoginStatusEnum {
  LOGGED_IN = 'loggedIn',
  LOGGED_OUT = 'loggedOut',
}
export enum UserTypeEnum {
  PASSIVE = 'passive',
  ACTIVE = 'active',
}
registerEnumType(UserLoginStatusEnum, {
  name: 'UserLoginStatusEnum',
});
registerEnumType(UserTypeEnum, {
  name: 'UserTypeEnum',
});
```

Examples of **correct** code that does not trigger this rule:

```js
/*eslint : only-constants-in-enum "error"*/
import { registerEnumType } from '@nestjs/graphql';
export enum UserLoginStatusEnum {
  LOGGED_IN = 1,
  LOGGED_OUT = 0,
}
registerEnumType(UserLoginStatusEnum, {
  name: 'UserLoginStatusEnum',
});
```
