const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/view-correct-location-and-name');

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

ruleTesterInstance.run('view-correct-location-and-name', ruleUnderTest, {
  valid: [
    {
      code: '',
      filename: 'frontend/src/views/users/users.view.tsx',
    },
    {
      code: 'export const UsersView: FunctionComponent = () => {}',
      filename: 'frontend/src/views/users/users.view.tsx',
    },
  ],
  invalid: [
    {
      code: 'export const Users: FunctionComponent = () => {}',
      errors: [{ message: 'Exported function component name should match the file name' }],
      filename: 'frontend/src/views/users/users.view.tsx',
    },
    {
      code: '',
      errors: [{ message: 'All views should be placed in this location (frontend/src/views/{view-name}/{view-name}.view.tsx)' }],
      filename: 'frontend/src/utils/users.view.tsx',
    },
  ],
});
