const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-invalid-filename-chars-frontend');
// const { allowedNamingPattern } = require('../../../constants');
const allowedNamingPattern = '[\[\]_a-z0-9-.]+';

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

ruleTesterInstance.run('no-invalid-filename-chars-frontend', ruleUnderTest, {
  valid: [
    {
      code: '// File Path : frontend/src/pages/components/alert/index.tsx',
      filename: 'frontend/src/pages/components/alert/index.tsx',
    },
    {
      code: '// File Path : frontend/src/pages/api/auth/[...nextauth].ts',
      filename: 'frontend/src/pages/api/auth/[...nextauth].ts',
    },
  ],
  invalid: [
    {
      code: '// File Path : frontend/src/layouts/auth/auT%h.layout.tsx',
      errors: [{
        messageId: 'containsInvalidChars',
        data: {
          invalidCharList: ['T', '%'],
          allowedNamingPattern: new RegExp(allowedNamingPattern),
        },
      },
      ],
      filename: 'frontend/src/layouts/auth/auT%h.layout.tsx',
    },
    {
      code: '// File Path : frontend/src/components/notifications/hooks/use-Notifications-aCtions.hook.ts',
      errors: [{
        messageId: 'containsInvalidChars',
        data: {
          invalidCharList: ['N', 'C'],
          allowedNamingPattern: new RegExp(allowedNamingPattern),
        },
      },
      ],
      filename: 'frontend/src/components/notifications/hooks/use-Notifications-aCtions.hook.ts',
    },
  ],
});
