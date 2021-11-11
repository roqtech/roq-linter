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
  ],
  invalid: [
    {
      code: 'export const useAuth = ()=>{/* definition */}',
      errors: [
        {
          message: 'All components and their related styles should be placed in their own directory (.../components/{component-name}/{component-name}.component.tsx)',
        },
      ],
      filename: 'frontend/src/modules/common/components/dialog.component.ts',
    },
    {
      code: '// File Path : frontend/src/modules/common/components/notification/notifications.component.ts',
      errors: [
        {
          message: 'The file-name and the parent directory name should match',
        },
      ],
      filename: 'frontend/src/modules/common/components/notification/notifications.component.ts',
    },
  ],
});
