const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/define-http-status-enum');

const ruleTester = new RuleTester(
  {
    parserOptions: { ecmaVersion: 2021 },
    parser: require.resolve('@typescript-eslint/parser'),
  },
);

ruleTester.run('define-http-status-enum', ruleUnderTest, {
  valid: [{
    code: `
      throw new HttpException('The link is not valid', HttpStatus.UNPROCESSABLE_ENTITY)
    `,
  },
  ],

  invalid: [{
    code: `
      throw new HttpException('The link is not valid', UNPROCESSABLE_ENTITY)
    `,
    errors: [{
      message: 'Second parameter is not HttpStatus enum',
    }],
  },
  {
    code: `
      throw new HttpException('The link is not valid')
    `,
    errors: [{
      message: 'HttpStatus enum is missing in second parameter',
    }],
  },
  ],
});
