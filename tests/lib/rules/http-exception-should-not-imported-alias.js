const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/http-exception-should-not-imported-alias');

const ruleTesterInstance = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTesterInstance.run('http-exception-should-not-imported-alias', ruleUnderTest, {
  valid: [{
    code: `
      import { HttpException } from '@nestjs/common'
    `,
  }],
  invalid: [{
    code: `
      import { HttpException as Hp } from '@nestjs/common'
    `,
    errors: [{
      message: 'HttpException should not be import using alias',
    }],
  }],
});
