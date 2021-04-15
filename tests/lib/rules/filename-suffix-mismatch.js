const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/filename-suffix-mismatch');

const ruleTesterInstance = new RuleTester({
  parserOptions: { ecmaVersion: 2021 },
  settings: {
    'roq-linter': {
      backendBasePath: 'backend/src',
      frontendBasePath: 'frontend/src',
    },
  },
});

ruleTesterInstance.run('filename-suffix-mismatch', ruleUnderTest, {
  valid: [
    {
      code: '// File Path : backend/src/auth/auth.module.ts',
      filename: 'backend/src/auth/auth.module.ts',
    },
    {
      code: '// File Path : backend/src/auth/dto/auth-init-provider.dto.ts',
      filename: 'backend/src/auth/dto/auth-init-provider.dto.ts',
    },
  ],
  invalid: [
    {
      code: '// File Path: backend/src/auth/auth.ts',
      errors: [{
        messageId: 'exceptionalSuffixMismatch',
        data: {
          expectedFileName: 'auth.module.ts',
          parentType: 'module',
        },
      },
      ],
      filename: 'backend/src/auth/auth.ts',
    },
    {
      code: '// File Path: backend/src/auth/dto/auth-init.provider.dto.ts',
      errors: [{
        messageId: 'regularSuffixMismatch',
        data: {
          expectedFileName: 'auth-init-provider.dto.ts',
        },
      },
      ],
      filename: 'backend/src/auth/dto/auth-init.provider.dto.ts',
    },
  ],
});
