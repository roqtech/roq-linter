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
      code: 'export const UsersView = withAuth()(() => {});',
      filename: 'frontend/src/views/users/users.view.tsx',
    },
  ],
  invalid: [
    {
      code: 'export const Users = withAuth()(() => {}); // File Path : frontend/src/views/users/users.view.tsx',
      errors: [{ message: 'Exported function component name should match the file name' }],
      filename: 'frontend/src/views/users/users.view.tsx',
    },
    {
      code: 'export const UsersView = withAuth()(() => {}); // File Path : frontend/src/utils/users.view.tsx',
      errors: [{ message: 'All views should be placed in this location (frontend/src/views/{view-name}/{view-name}.view.tsx)' }],
      filename: 'frontend/src/utils/users.view.tsx',
    },
    {
      code: `export const breadcrumbs = [ { label: "home", href: "/", translate: true } ];
      export const UsersView = withAuth()(() => {}); // File Path : frontend/src/utils/users.view.tsx`,
      errors: [
        { message: 'All views should be placed in this location (frontend/src/views/{view-name}/{view-name}.view.tsx)' },
        { message: 'Views should only have a single export and that should be the function component' },

      ],
      filename: 'frontend/src/utils/users.view.tsx',
    },
  ],
});
