const { RuleTester } = require('eslint');
const { resolve } = require('path');
const ruleUnderTest = require('../../../lib/rules/filename-suffix-mismatch');

const testDummiesBasePath = resolve('./tests/dummies');

const ruleTesterInstance = new RuleTester({
  parserOptions: { ecmaVersion: 2021 },
  settings: {
    'roq-linter': {
      backendBasePath: 'roq-linter/tests/dummies/backend',
      frontendBasePath: 'roq-linter/tests/dummies/frontend',
    },
  },
});

ruleTesterInstance.run('filename-suffix-mismatch', ruleUnderTest, {
  valid: [
    {
      code: '// File Path : tests/dummies/backend/auth/auth.module.ts',
      filename: resolve(testDummiesBasePath, 'backend/auth/auth.module.ts'),

    },
    {
      code: '// File Path : tests/dummies/backend/auth/dtos/auth-init-provider.dto.ts',
      filename: resolve(testDummiesBasePath, 'backend/auth/dtos/auth-init-provider.dto.ts'),
    },
  ],
  invalid: [
    {
      code: '// File Path: tests/dummies/backend/auth/auth.ts',
      errors: [{
        messageId: 'exceptionalSuffixMismatch',
        data: {
          expectedFileName: 'auth.module.ts',
          parentType: 'module',
        },
      },
      ],
      filename: resolve(testDummiesBasePath, 'backend/auth/auth.ts'),
    },
    {
      code: '// File Path: tests/dummies/backend/auth/dtos/auth-init.provider.dto.ts',
      errors: [{
        messageId: 'regularSuffixMismatch',
        data: {
          expectedFileName: 'auth-init-provider.dto.ts',
        },
      },
      ],
      filename: resolve(testDummiesBasePath, 'backend/auth/dtos/auth-init.provider.dto.ts'),

    },
  ],
});
