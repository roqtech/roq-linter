# Warning on an incorrect prefix or suffix of exported enums, components, interfaces, constants names (correct-export-name-components-layouts-actions)

## Rule Details

This rule is aimed at reporting on an incorrect prefix or suffix of exported enums, components, interfaces, constants names

**What we want to cover:**
1) exported enums, components, interfaces should have the file-name prefixed to their name (IN PascalCased)
2) exported enum and interface names should be suffixed with their type(enum or interface)
3) exported constants in slices or actions should have the file-name prefixed to their name (IN camelCased)

Examples of **incorrect** code for this rule:

```tsx
// alert-icon.tsx file
export enum AlertEnum {}
export enum AlerticonEnum {}
export enum Alert {}
export enum AlertIcon {}
export enum Alerticon {}

export interface AlertInterface {}
export interface AlerticonInterface {}
export interface Alert {}
export interface AlertIcon {}
export interface Alerticon {}

export const AlerticonTest: FunctionComponent = () => {}
export const alertIcon: FunctionComponent = () => {}
export const alert: FunctionComponent = () => {}
export const AlertTest: FunctionComponent = () => {}

// account-activate.action.ts file
export const AccountActivateAction = createAsyncThunk()
export const AccountactivateAction = createAsyncThunk()
export const AccountAction = createAsyncThunk()
```

Examples of **correct** code for this rule:

```ts
// alert-icon.tsx file
export enum AlertIconEnum {}

export interface AlertIconInterface {}

export const AlertIcon: FunctionComponent = () => {}

// account-activate.action.ts file
export const accountActivateAction = createAsyncThunk()
```
