const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-use-deprecated-modules');

const ruleTesterInstance = new RuleTester({
  parserOptions: { ecmaVersion: 2021 },
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTesterInstance.run('no-use-deprecated-modules', ruleUnderTest, {
  valid: [
    {
      code: 'import { createSlice } from \'@reduxjs/toolkit\';',
      filename: 'sample.ts',
      options: [['moment', 'request']],
    },
    {
      code: 'import { NextPage } from \'next\';',
      filename: 'sample.ts',
      options: [['moment', 'request']],
    },
  ],
  invalid: [
    {
      code: 'import moment from \'moment\';',
      errors: [{ message: 'Avoid usage of deprecated modules.' }],
      filename: 'sample.ts',
      options: [['moment', 'request']],
    },
    {
      code: 'import request from \'request\';',
      errors: [{ message: 'Avoid usage of deprecated modules.' }],
      filename: 'sample.ts',
      options: [['moment', 'request']],
    },
  ],
});
