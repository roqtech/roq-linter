# Warning on declaring *Enums*, *Types*, *Interfaces* in files where they are no longer used (correct-location-enums-types-interfaces)

If there are any Enums/Types/Interfaces for component - they should be places in the same file with this component

## Rule Details

This rule will throw warning on all Enums/Types/Interfaces which are declared in the component but not used in it

Examples of **incorrect** code for this rule:

```ts
// in "button.tsx" component:
export interface IconButtonInterface {};
// IconButtonInterface should be placed in "icon-button.tsx" component
```

Examples of **correct** code for this rule:

```ts
// in "button.tsx" component:
export interface ButtonInterface {
  anyKey: string
};
console.log(ButtonInterface)
// correct - ButtonInterface is using in "button.tsx" component
```
