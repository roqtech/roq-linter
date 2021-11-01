const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/correct-export-name-components-layouts-actions');

const ruleTesterInstance = new RuleTester({
  parserOptions: { ecmaVersion: 2021 },
  parser: require.resolve('@typescript-eslint/parser'),
  settings: {
    'roq-linter': {
      backendBasePath: 'backend/src',
      frontendBasePath: 'frontend/src',
      backendTestsBasePath: 'backend/tests',
    },
  },
});

ruleTesterInstance.run('correct-export-name-components-layouts-actions', ruleUnderTest, {
  valid: [
    {
      code: 'export enum AlertIconEnum {}',
      filename: 'frontend/src/modules/common/components/alert-icon/alert-icon.component.tsx',
    },
    {
      code: 'export interface AlertIconInterface {}',
      filename: 'frontend/src/modules/common/components/alert-icon/alert-icon.component.tsx',
    },
    {
      code: 'export const AlertIcon: FunctionComponent = () => {}',
      filename: 'frontend/src/modules/common/components/alert-icon/alert-icon.component.tsx',
    },
    {
      code: 'export const accountActivateAction = createAsyncThunk()',
      filename: 'frontend/src/slices/auth-management/actions/account-activate.action.ts',
    },
  ],
  invalid: [
    {
      code: 'export enum AlertEnum {}',
      errors: [{ message: 'Exported enums, components, interfaces should be prefixed with PascalCased file name' }],
      filename: 'frontend/src/modules/common/components/alert/alert-icon.component.tsx',
    },
    {
      code: 'export enum AlertIcon {}',
      errors: [{ message: 'Exported enums and interfaces should be suffixed with their type. (Interface/Enum)' }],
      filename: 'frontend/src/modules/common/components/alert/alert-icon.component.tsx',
    },
    {
      code: 'export const Alerticon: FunctionComponent = () => {}',
      errors: [{ message: 'Exported enums, components, interfaces should be prefixed with PascalCased file name' }],
      filename: 'frontend/src/modules/common/components/alert/alert-icon.component.tsx',
    },
    {
      code: 'export const AccountAction = createAsyncThunk()',
      errors: [{ message: 'Exported constants should be prefixed with camelCased file name' }],
      filename: 'frontend/src/slices/auth-management/actions/account-activate.action.ts',
    },
  ],
});
