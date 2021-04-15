const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/imports-should-follow-conventions');

const ruleTesterInstance = new RuleTester({ parserOptions: { ecmaVersion: 2021, sourceType: 'module' } });

ruleTesterInstance.run('imports-should-follow-conventions', ruleUnderTest, {
  valid: [
    'import SomeComponent from "/common/components" ',
    'import Something from "layout"',
  ],
  invalid: [
    {
      code: 'import Something from "../folder/component"',
      errors: [{
        message: 'Use absolute path instead of relative.',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 44,
      }],
      filename: 'sample.ts',
    },
    {
      code: 'import Something from "layout/index"',
      errors: [{
        message: 'Omit index in import.',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 37,
      }],
      filename: 'sample.ts',
    },
  ],
});
