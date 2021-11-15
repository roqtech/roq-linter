const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-invalid-partial-and-component-resource');

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

ruleTesterInstance.run('no-invalid-partial-and-component-resource', ruleUnderTest, {
  valid: [
    {
      code: 'export const Comp1 = (props: CustomPropTypes): ReactElement =>{/* definition */}',
      filename: 'frontend/src/modules/auth/components/comp1/comp1.component.ts',
    },
    {
      code: 'export const Comp1 = (props: CustomPropTypes): ReactElement =>{/* definition */}',
      filename: 'frontend/src/modules/auth/components/comp1/comp1.component.ts',
    },
    {
      code: 'export const Dialog = (props: CustomPropTypes): ReactElement =>{/* definition */}',
      filename: 'frontend/src/views/partials/dialog/dialog.component.tsx',
    },
    {
      code: `export interface NotificationClasses {}
      export const useNotificationStyles = ()=>{/* definition */}`,
      filename: 'frontend/src/modules/common/components/notification/notification.styles.ts',
    },
  ],
  invalid: [
    {
      code: `export const Comp1= (props: CustomPropTypes): ReactElement =>{/* definition */}
      export const Comp2 = (props: CustomPropTypes): ReactElement =>{/* definition */}`,
      errors: [
        {
          messageId: 'missingOrExtraNamedExport',
        },
      ],
      filename: 'frontend/src/modules/common/components/dialog/dialog.component.ts',
    },
    {
      code: `export class Comp1 {/* definition */}
      export const Comp2 = (props: CustomPropTypes): ReactElement =>{/* definition */}`,
      errors: [
        {
          messageId: 'disallowedClassExport',
        },
      ],
      filename: 'frontend/src/modules/common/components/dialog/dialog.component.ts',
    },
    {
      code: '// File Path : frontend/src/modules/common/components/notification/notifications.component.ts With No code',
      errors: [
        {
          messageId: 'missingOrExtraNamedExport',
        },
        {
          messageId: 'invalidFileName',
          data: {
            expectedFileName: 'notification.component.tsx',
          },
        },
      ],
      filename: 'frontend/src/modules/common/components/notification/notifications.component.ts',
    },
  ],
});
