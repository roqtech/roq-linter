const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-invalid-resource-location');

const ruleTesterInstance = new RuleTester({
  parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
  parser: require.resolve('@typescript-eslint/parser'),
  settings: {
    'roq-linter': {
      backendBasePath: 'backend/src',
      frontendBasePath: 'frontend/src',
      backendTestsBasePath: 'backend/tests',
    },
  },
});

ruleTesterInstance.run('no-invalid-resource-location', ruleUnderTest, {
  valid: [
    {
      code: 'export const useDialogStyles = ()=>{/* definition */}',
      filename: 'frontend/src/modules/common/components/dialog/dialog.styles.ts',
    },
    {
      code: '// File Path : frontend/src/modules/common/components/dialog/dialog.component.tsx',
      filename: 'frontend/src/modules/common/components/dialog/dialog.component.tsx',
    },
    {
      code: `export interface NotificationClasses {}
      export const useNotificationStyles = ()=>{/* definition */}`,
      filename: 'frontend/src/modules/common/components/notification/notification.styles.ts',
    },
    {
      code: `export interface NotificationClasses {}
      export const useNotificationStyles = ()=>{/* definition */}`,
      filename: 'frontend/src/views/files/partials/drop/drop.partial.ts',
    },
  ],
  invalid: [
    {
      code: 'export const dialog = ()=>{/* definition */}',
      errors: [
        {
          message: 'All components and their related styles should be placed in their own directory (.../components/{component-name}/{component-name}.component.tsx)',
        },
        {
          message: 'The file-name and the parent directory name should match',
        },
      ],
      filename: 'frontend/src/modules/common/components/dialog.component.tsx',
    },
    {
      code: 'export const dialogPartial = ()=>{/* definition */}',
      errors: [
        {
          message: 'All partials and their related styles should be placed either in their own directory (.../partials/{partial-name}/{partial-name}.partial.tsx) or alongwith a related component in their directory',
        },
        {
          message: 'The file-name and the parent directory name should match',
        },
      ],
      filename: 'frontend/src/modules/common/components/dialog.partial.tsx',
    },
    {
      code: '// File Path : frontend/src/modules/common/components/notification/notifications.component.tsx',
      errors: [
        {
          message: 'The file-name and the parent directory name should match',
        },
      ],
      filename: 'frontend/src/modules/common/components/notification/notifications.component.tsx',
    },
    {
      code: '// File Path : frontend/src/modules/components/notifications/notifications.styles.tsx',
      errors: [
        {
          message: 'Components directory can only exist at the following path pattern modules/*/components',
        },
      ],
      filename: 'frontend/src/modules/components/notifications/notifications.styles.tsx',
    },
    {
      code: '// File Path : frontend/src/layouts/main/components/notification/notifications.component.tsx',
      errors: [
        {
          message: 'Layouts should have partials instead of components. A good start to fix this could be to rename super parent "components" dir to "partials"',
        },
        {
          message: 'All components and their related styles should be placed in their own directory (.../components/{component-name}/{component-name}.component.tsx)',
        },
        {
          message: 'The file-name and the parent directory name should match',
        },
        {
          message: 'Components directory can only exist at the following path pattern modules/*/components',
        },
      ],
      filename: 'frontend/src/layouts/main/components/notification/notifications.component.tsx',
    },
    {
      code: '// File Path : frontend/src/layouts/main/partials/notification/notification.tsx',
      errors: [
        {
          message: 'The partials directory can only exist at the path pattern [views, layouts, components]/*/partials',
        },
      ],
      filename: 'frontend/src/modules/partials/notification/notification.tsx',
    },
  ],
});
