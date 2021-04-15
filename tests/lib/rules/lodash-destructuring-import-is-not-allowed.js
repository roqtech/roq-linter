const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/lodash-destructuring-import-is-not-allowed');

const ruleTesterInstance = new RuleTester({ parserOptions: { ecmaVersion: 2021, sourceType: 'module' } });

ruleTesterInstance.run('lodash-destructuring-import-is-not-allowed', ruleUnderTest, {
  valid: [
    {
      code: 'import merge from \'lodash/merge\'',
      filename: 'some.class.ts',
    },
    {
      code: 'import _merge from \'lodash/merge\'',
      filename: 'some.class.ts',
    },
  ],
  invalid: [
    {
      code: 'import { merge } from \'lodash\'',
      errors: [{
        message: 'Destructuring import is not allowed. Use only direct default import of functions.',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 31,
      }],
      filename: 'folder/some.component.ts',
    },
    {
      code: 'import _merge from \'lodash\'',
      errors: [{
        message: 'Destructuring import is not allowed. Use only direct default import of functions.',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 28,
      }],
      filename: 'folder/any-component.ts',
    },
  ],
});
