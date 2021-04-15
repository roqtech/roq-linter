const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-invalid-filename-pattern');

const ruleTesterInstance = new RuleTester({
  parserOptions: { ecmaVersion: 2021 },
  settings: {
    'roq-linter': {
      backendBasePath: 'backend/src',
      frontendBasePath: 'frontend/src',
      backendTestsBasePath: 'backend/tests',
    },
  },
});

ruleTesterInstance.run('no-invalid-filename-pattern', ruleUnderTest, {
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
      code: '// File Path : backend/src/my-module/dtos/my.Module_login-new.dto.ts',
      errors: [
        {
          messageId: 'invalidSeparatorPattern',
        },
      ],
      filename: 'backend/src/my-module/dtos/my.Module_login-new.dto.ts',
    },
    {
      code: '// File Path : backend/src/my-module/dtos/my-module.login-new.dto.ts',
      errors: [{
        messageId: 'invalidSeparatorPattern',
      },
      ],
      filename: 'backend/src/my-module/dtos/my-module.login-new.dto.ts',
    },
  ],
});
