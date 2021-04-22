const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-invalid-filename-chars');
// const { allowedNamingPattern } = require('../../../constants');
const allowedNamingPattern = '[a-z0-9-.]+';

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

ruleTesterInstance.run('no-invalid-filename-chars', ruleUnderTest, {
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
      errors: [{
        messageId: 'containsInvalidChars',
        data: {
          invalidCharList: ['M', '_'],
          allowedNamingPattern: new RegExp(allowedNamingPattern),
        },
      },
      ],
      filename: 'backend/src/my-module/dtos/my.Module_login-new.dto.ts',
    },
    {
      code: '// File Path : backend/src/my-module/dtos/my-Module-lOgin-new.dto.ts',
      errors: [{
        messageId: 'containsInvalidChars',
        data: {
          invalidCharList: ['M', 'O'],
          allowedNamingPattern: new RegExp(allowedNamingPattern),
        },
      },
      ],
      filename: 'backend/src/my-module/dtos/my-Module-lOgin-new.dto.ts',
    },
  ],
});
