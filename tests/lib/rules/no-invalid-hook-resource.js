const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-invalid-hook-resource');

const ruleTesterInstance = new RuleTester({
  parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
  settings: {
    'roq-linter': {
      backendBasePath: 'backend/src',
      frontendBasePath: 'frontend/src',
      backendTestsBasePath: 'backend/tests',
    },
  },
});

ruleTesterInstance.run('no-invalid-hook-resource', ruleUnderTest, {
  valid: [
    {
      code: 'export const useAuthHook = ()=>{/* definition */}',
      filename: 'frontend/src/common/roq-hooks/use-auth/use-auth.hook.ts',
    },
    {
      code: 'export const useNotifProviderHook = ()=>{/* definition */}',
      filename: 'frontend/src/components/notifications/hooks/use-notif-provider.hook.ts',
    },
  ],
  invalid: [
    {
      code: 'export const useAuth = ()=>{/* definition */}',
      errors: [
        {
          messageId: 'invalidExportedHookName',
          data: {
            resourceName: 'useAuthHook',
          },
        },
      ],
      filename: 'frontend/src/common/roq-hooks/use-auth/use-auth.hook.ts',
    },
    {
      code: 'export const useNotifProviderHook = ()=>{/* definition */}',
      errors: [
        {
          messageId: 'invalidFileName',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 59,
        },
      ],
      filename: 'frontend/src/components/notifications/hooks/notif-provider.hook.ts',
    },
    {
      code: 'export const useNotifProviderHoo = ()=>{/* definition */}',
      errors: [
        {
          messageId: 'invalidFileName',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 58,
        },
        {
          messageId: 'invalidExportedHookName',
          data: {
            resourceName: 'useNotifProviderHook',
          },
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 58,
        },
      ],
      filename: 'frontend/src/components/notifications/hooks/notif-provider.hook.ts',
    },
  ],
});
