# Break lines between object properties are not allowed (no-spaces-in-object-definition)

Empty lines in object definitions are forbidden.

## Rule Details

This rule will report all empty lines in object definitions.

Examples of **incorrect** code for this rule:

```js
const obj = { prop1 : 'a',

prop2: 'b'}

const obj3 = { something : 'a', 
something2: 'b',

property: 'c'}
```

Examples of **correct** code for this rule:

```js
const obj = { prop1 : 'a',
              prop2 : 'b'}

const obj3 = { something : 'a', 
               something2: 'b',
               property  : 'c'}
```
