const { RuleTester } = require('eslint');
const { resolve } = require('path');
const ruleUnderTest = require('../../../lib/rules/dir-contains-index');

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

ruleTesterInstance.run('dir-contains-index', ruleUnderTest, {
  valid: [
    {
      code: '// Directory: tests/dummies/backend/event/',
      filename: resolve(testDummiesBasePath, 'backend/event/event.module.ts'),
    },
  ],
  invalid: [
    {
      code: '// Directory: tests/dummies/backend/auth/',
      errors: [{
        messageId: 'suggestion',
        data: {
          dir: resolve(testDummiesBasePath, 'backend/auth'),
        },
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 42,
      },
      ],
      filename: resolve(testDummiesBasePath, 'backend/auth/auth.module.ts'),
    },
  ],
});
