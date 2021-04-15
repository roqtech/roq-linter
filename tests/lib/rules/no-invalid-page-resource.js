const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-invalid-page-resource');

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

ruleTesterInstance.run('no-invalid-page-resource', ruleUnderTest, {
  valid: [
    {
      code: `/* accountActivatePage definition */
       export default AccountActivatePage;`,
      filename: 'frontend/src/pages/account-activate/index.tsx',
    },
    {
      code: `/* LoginPage definition */
      export default LoginPage;`,
      filename: 'frontend/src/pages/login/index.tsx',
    },
    {
      code: `/* VerifyEmailPage definition */
      export default VerifyEmailPage;`,
      filename: 'frontend/src/pages/verify-email/index.tsx',
    },
  ],
  invalid: [
    {
      code: `/* accountActivatePage definition */
       export default AccountActivate;`,
      errors: [
        {
          messageId: 'invalidPageResource',
          data: {
            expectedPageName: 'AccountActivatePage',
          },
          line: 2,
          column: 8,
          endLine: 2,
          endColumn: 39,
        },
      ],
      filename: 'frontend/src/pages/account-activate/index.tsx',
    },
    {
      code: `/* This file misses the required export default */
       `,
      errors: [
        {
          messageId: 'missingOrExtraDefaultExport',
          data: {
            expectedPageName: 'AccountActivatePage',
          },
          line: 1,
          column: 1,
          endLine: 2,
          endColumn: 8,
        },
      ],
      filename: 'frontend/src/pages/account-activate/index.tsx',
    },
    {
      code: `/* verifyEmailPage definition */
      export default verifyEmailPage;`,
      errors: [
        {
          messageId: 'invalidPageResource',
          data: {
            expectedPageName: 'VerifyEmailPage',
          },
          line: 2,
          column: 7,
          endLine: 2,
          endColumn: 38,
        },
      ],
      filename: 'frontend/src/pages/verify-email/index.tsx',
    },
  ],
});
