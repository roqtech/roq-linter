const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-spaces-in-object-definition');

const ruleTesterInstance = new RuleTester({ parserOptions: { ecmaVersion: 2021 } });

ruleTesterInstance.run('no-spaces-in-object-definition', ruleUnderTest, {
  valid: [
    'const obj = { prop1 : \'a\',\n'
    + '              prop2 : \'b\'}',
    'const obj3 = {\n'
    + '               something : \'a\',\n'
    + '               something2: \'b\',\n'
    + '               property  : \'c\'\n'
    + '             }',
  ],
  invalid: [
    {
      code: 'const obj = { prop1 : \'a\',\n'
        + '\n'
        + 'prop2: \'b\'}',
      errors: [{
        message: 'Avoid spaces in object definition',
        line: 3,
        column: 1,
        endLine: 3,
        endColumn: 11,
      }],
      filename: 'sample.ts',
    },
    {
      code: 'const obj3 = { something : \'a\',\n'
        + 'something2: \'b\',\n'
        + '\n'
        + 'property: \'c\'}',
      errors: [{
        message: 'Avoid spaces in object definition',
        line: 4,
        column: 1,
        endLine: 4,
        endColumn: 14,
      }],
      filename: 'sample.ts',
    },
    {
      code: 'const obj3 = { something : \'a\', \n'
        + '\n'
        + 'something2: \'b\',\n'
        + '\n'
        + 'property: \'c\'}',
      errors: 2,
      filename: 'sample.ts',
    },
    {
      code: 'const obj3 = { something : \'a\',\n'
        + '\n'
        + 'something2: \'b\',\n'
        + '\n'
        + 'property: \'c\'}\n'
        + 'const obj = { prop1 : \'a\',\n'
        + '\n'
        + 'prop2: \'b\'}',
      errors: 3,
      filename: 'sample.ts',
    },
  ],
});
