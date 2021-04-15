const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-invalid-dirname');

const ruleTesterInstance = new RuleTester({ parserOptions: { ecmaVersion: 2021 } });

ruleTesterInstance.run('no-invalid-dirname', ruleUnderTest, {
  valid: [
    {
      code: '// File Path : backend/src/auth/auth.module.ts',
      filename: 'backend/src/auth/auth.module.ts',
    },
    {
      code: '// File Path : backend/src/authDummy.v1.0.0/auth.module.ts',
      filename: 'backend/src/authDummy.v1.0.0/auth.module.ts',
      options: [{ casing: 'camelCased' }],
    },
    {
      code: '// File Path : backend/src/authDummy.v1.0.1/auth.module.ts',
      filename: 'backend/src/authDummy.v1.0.1/auth.module.ts',
      options: [{ casing: 'camelCased', allowedSeparator: 'dot' }],
    },
    {
      code: '// File Path : backend/src/authDummy.v1.0.2/auth.module.ts',
      filename: 'backend/src/authDummy.v1.0.2/auth.module.ts',
      options: [{ casing: 'camelCased', allowedSeparator: 'dot', noNumerics: false }],

    },
    {
      code: '// File Path : backend/src/authDummy-v1.0.0/auth.module.ts',
      filename: 'backend/src/authDummy-v1.0.0/auth.module.ts',
      options: [{ casing: 'camelCased', allowedSeparator: 'any', noNumerics: false }],
    },
    {
      code: '// File Path : frontend/src/component/alert-dummy/index.ts',
      filename: 'frontend/src/component/alert-dummy/index.ts',
      options: [{ casing: 'lowerCased', allowedSeparator: 'hyphen', noNumerics: true }],
    },
    {
      code: '// File Path : frontend/src/component/notification-dummy/index.ts',
      filename: 'frontend/src/component/notification-dummy/index.ts',
      options: [{ casing: 'lowerCased', allowedSeparator: 'hyphen', noNumerics: false }],
    },
    {
      code: '// File Path : frontend/src/component/notification-dummy.v1.0.0/index.ts',
      filename: 'frontend/src/component/notification-dummy.v1.0.0/index.ts',
      options: [{ casing: 'lowerCased', allowedSeparator: 'any', noNumerics: false }],
    },
  ],
  invalid: [
    {
      code: '// File Path : backend/src/eventDummy.v1/event.module.ts',
      errors: [
        {
          messageId: 'invalidDirName',
          data: {
            dirName: 'eventDummy.v1',
            expectedDescription: 'It should be a lowerCased string with numbers and with any separator(s)',
          },
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 57,
        },
      ],
      filename: 'backend/src/eventDummy.v1/event.module.ts',
    },
    {
      code: '// File Path : frontend/src/component/notification-dummy.v1.0.1/index.ts',
      errors: [
        {
          messageId: 'invalidDirName',
          data: {
            dirName: 'notification-dummy.v1.0.1',
            expectedDescription: 'It should be a lowerCased string with numbers and with hyphen separator(s)',
          },
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 73,
        },
      ],
      filename: 'frontend/src/component/notification-dummy.v1.0.1/index.ts',
      options: [{ casing: 'lowerCased', allowedSeparator: 'hyphen', noNumerics: false }],
    },
    {
      code: '// File Path : frontend/src/component/notification-dummy.v1.0.2/index.ts',
      errors: [
        {
          messageId: 'invalidDirName',
          data: {
            dirName: 'notification-dummy.v1.0.2',
            expectedDescription: 'It should be a lowerCased string without numbers and with hyphen separator(s)',
          },
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 73,
        },
      ],
      filename: 'frontend/src/component/notification-dummy.v1.0.2/index.ts',
      options: [{ casing: 'lowerCased', allowedSeparator: 'hyphen', noNumerics: true }],
    },
  ],
});
