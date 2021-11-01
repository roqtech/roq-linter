const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-invalid-common-component-naming');

const ruleTesterInstance = new RuleTester({
  parserOptions: { ecmaVersion: 2021 },
  settings: {
    'roq-linter': {
      backendBasePath: 'backend/src',
      frontendBasePath: 'frontend/src',
      backendTestsBasePath: 'backend/tests',
    },
  },
});

ruleTesterInstance.run('no-invalid-common-component-naming', ruleUnderTest, {
  valid: [
    {
      code: '// File Path : frontend/src/modules/common/time-picker/time-picker-item.tsx',
      filename: 'frontend/src/modules/common/components/time-picker/time-picker-item.tsx',
    },
    {
      code: '// With options [\'select\'] File Path : frontend/src/modules/common/select/option-group.tsx',
      filename: 'frontend/src/modules/common/components/select/option-group.tsx',
      options: [['select']],
    },

  ],
  invalid: [
    {
      code: '// File Path : frontend/src/modules/common/components/time-picker/picker-item.tsx',
      errors: [{
        messageId: 'missingComponentPrefix',
        data: {
          expectedFileName: 'time-picker-picker-item.tsx',
        },
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 82,
      },
      ],
      filename: 'frontend/src/modules/common/components/time-picker/picker-item.tsx',
    },
    {
      code: '// With No options specified. File Path : frontend/src/common/roq-ui/select/option-group.tsx',
      errors: [
        {
          messageId: 'missingComponentPrefix',
          data: {
            expectedFileName: 'select-option-group.tsx',
          },
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 93,
        },
      ],
      filename: 'frontend/src/modules/common/components/select/option-group.tsx',
    },
  ],
});
