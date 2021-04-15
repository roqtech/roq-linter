const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/http-status-should-not-imported-alias');

const ruleTesterInstance = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTesterInstance.run('http-status-should-not-imported-alias', ruleUnderTest, {
  valid: [{
    code: `
      import { HttpStatus } from '@nestjs/common'
    `,
  }],
  invalid: [{
    code: `
      import { HttpStatus as Hp } from '@nestjs/common'
    `,
    errors: [{
      message: 'HttpStatus should not be import using alias',
    }],
  }],
});
