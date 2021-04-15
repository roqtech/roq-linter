# Warning on incorrect extending interfaces in component files (use-extends-in-components)

It is correct to use **extends** instead of **&** in components interfaces.

## Rule Details

This rule is aimed at reporting on using **&** to add interfaces to the component while declaration

Examples of **incorrect** code for this rule:

```js
// export const Alert: FunctionComponent<AlertInterface> & Omit<HTMLAttributes<HTMLDivElement>, 'title'> = () => {}
```

Examples of **correct** code for this rule:

```js
// export interface AlertInterface extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {}

// export const Alert: FunctionComponent<AlertInterface> = () => {}
```
