const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-invalid-style-resource');

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

ruleTesterInstance.run('no-invalid-style-resource', ruleUnderTest, {
  valid: [
    {
      code: 'export const useDialogStyles = ()=>{/* definition */}',
      filename: 'frontend/src/modules/common/components/dialog/dialog.styles.ts',
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
          messageId: 'invalidExportedHookName',
          data: {
            resourceName: 'useDialogStyles',
          },
        },
      ],
      filename: 'frontend/src/modules/common/components/dialog/dialog.styles.ts',
    },
    {
      code: `export interface dialogStyles {}
      export const useNotifProvider = ()=>{/* definition */}`,
      errors: [
        {
          messageId: 'invalidInterfaceName',
          data: {
            resourceName: 'NotificationClasses',
          },
        },
        {
          messageId: 'invalidExportedHookName',
          data: {
            resourceName: 'useNotificationStyles',
          },
        },
      ],
      filename: 'frontend/src/modules/common/components/notification/notification.styles.ts',
    },
    {
      code: '',
      errors: [
        {
          messageId: 'invalidFileName',
          data: {
            expectedFileName: 'notification.styles.ts',
          },
        },
      ],
      filename: 'frontend/src/modules/common/components/notification/notifi.styles.ts',
    },
    {
      code: `export interface dialogStyles {}
      export const useNotifProvider = ()=>{/* definition */}`,
      errors: [
        {
          messageId: 'invalidInterfaceName',
          data: {
            resourceName: 'NotificationClasses',
          },
        },
        {
          messageId: 'invalidExportedHookName',
          data: {
            resourceName: 'useNotificationStyles',
          },
        },
      ],
      filename: 'frontend/src/modules/common/components/notification/notification.styles.ts',
    },

  ],
});
