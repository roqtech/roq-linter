const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-ineffective-clsx');

const ruleTesterInstance = new RuleTester({ parserOptions: { ecmaVersion: 2021, sourceType: 'module' } });

ruleTesterInstance.run('no-ineffective-clsx', ruleUnderTest, {
  valid: [
    {
      code: `import clsx from 'clsx';
      let year = clsx('text-body dark:text-offWhite');`,
      filename: 'sample.tsx',
    },
    {
      code: `import clsx from 'clsx';
      let hour = (hour) => clsx({
        'dark:text-offWhite' : selectedHour !== hour
      })`,
      filename: 'sample.tsx',
    },
  ],
  invalid: [
    {
      code: `import clsx from 'clsx';
      let year = clsx('', 'text-body dark:text-offWhite');`,
      errors: [{
        messageId: 'unexpectedArgument',
        data: { instanceOf: 'string' },
        line: 2,
        column: 23,
        endLine: 2,
        endColumn: 25,
      }],
      filename: 'sample.tsx',
    },
    {
      code: `import clsx from 'clsx';
      let hour = (hour) => clsx({
        'dark:text-offWhite' : selectedHour !== hour
      }, {})`,
      errors: [{
        messageId: 'unexpectedArgument',
        data: { instanceOf: 'object' },
        line: 4,
        column: 10,
        endLine: 4,
        endColumn: 12,
      }],
      filename: 'sample.tsx',
    },
    {
      code: `import clsx from 'clsx';
      let hour = (hour) => clsx('', {
        'dark:text-offWhite' : selectedHour !== hour
      }, {})`,
      errors: [
        {
          messageId: 'unexpectedArgument',
          data: { instanceOf: 'string' },
          line: 2,
          column: 33,
          endLine: 2,
          endColumn: 35,
        },
        {
          messageId: 'unexpectedArgument',
          data: { instanceOf: 'object' },
          line: 4,
          column: 10,
          endLine: 4,
          endColumn: 12,
        },
      ],
      filename: 'sample.tsx',
    },
  ],
});
