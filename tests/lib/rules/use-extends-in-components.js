const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/use-extends-in-components');

const ruleTesterInstance = new RuleTester({
  parserOptions: { ecmaVersion: 2021 },
  parser: require.resolve('@typescript-eslint/parser'),
  settings: {
    'roq-linter': {
      backendBasePath: 'backend/src',
      frontendBasePath: 'frontend/src',
      backendTestsBasePath: 'backend/tests',
    },
  },
});

ruleTesterInstance.run('use-extends-in-components', ruleUnderTest, {
  valid: [
    {
      code: 'export interface AlertInterface extends Omit<> {}'
        + 'export const Alert: FunctionComponent<AlertInterface> = () => {}',
      filename: 'frontend/src/common/roq-ui/alert/alert.tsx',
    },
  ],
  invalid: [
    {
      code: 'export const Alert: FunctionComponent<> & Omit<> = () => {}',
      errors: [{ message: 'Use "extends" instead of "&"' }],
      filename: 'frontend/src/common/roq-ui/alert/alert.tsx',
    },
  ],
});
