# Files should only export enums and enum members should only be constants (only-constants-in-enum)

The rule checks that enums adheres to some laid down convention. This is a backend specific rule.

## Rule Details

This rule expects that files should only have enum defined, which is registered with nestjs using 'registerEnumType' call and all enum members are defined using constants and no properties or methods are used. This rule applies to all enums that are defined in the files matching the following pattern (Except index.ts):

> backend/src/{module}/enums/{filename}.ts

Examples of **incorrect** code that trigger this rule:

```js
/*eslint : only-constants-in-enum "error"*/
import { registerEnumType } from '@nestjs/graphql';
export enum UserLoginStatusEnum {
        LOGGED_IN = 'loggedIn',
        LOGGED_OUT = ()=>'loggedOut',
}
registerEnumType(UserLoginStatusEnum, {
  name: 'UserLoginStatusEnum',
});
```

```js
/*eslint : only-constants-in-enum "error"*/
import { registerEnumType } from '@nestjs/graphql';
export enum UserLoginStatusEnum {
        LOGGED_IN = 'loggedIn',
        LOGGED_OUT = ()=>'loggedOut',
}
(()=>{registerEnumType(UserLoginStatusEnum, {
  name: 'UserLoginStatusEnum',
});})()
```

Examples of **correct** code that does not trigger this rule:

```js
/*eslint : only-constants-in-enum "error"*/
import { registerEnumType } from '@nestjs/graphql';
export enum UserLoginStatusEnum {
        LOGGED_IN = 'loggedIn',
        LOGGED_OUT = 'loggedOut',
}
registerEnumType(UserLoginStatusEnum, {
  name: 'UserLoginStatusEnum',
});
```

