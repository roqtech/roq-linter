const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-comments-with-no-content');

const ruleTesterInstance = new RuleTester({ parserOptions: { ecmaVersion: 2021 } });

ruleTesterInstance.run('no-comments-with-no-content', ruleUnderTest, {
  valid: [
    '// comment ',
    '/*  comments */',
  ],
  invalid: [
    {
      code: '//',
      errors: [{
        message: 'Comments without content are not allowed',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 3,
      }],
      filename: 'sample.ts',
    },
    {
      code: '\n/**/',
      errors: [{
        message: 'Comments without content are not allowed',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 5,
      }],
      filename: 'sample.ts',
    },
    {
      code: '//\n//\n//',
      errors: 3,
      filename: 'sample.ts',
    },
    {
      code: '//\n/**/',
      errors: 2,
      filename: 'sample.ts',
    },
    {
      code: 'let t = 12; //',
      errors: 1,
      filename: 'sample.ts',
    },
    {
      code: 'let t = 12;\n //\n let k = 5\n/* */\n/* test */',
      errors: 2,
      filename: 'sample.ts',
    },
  ],
});
