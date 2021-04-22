const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-eslint-disable');

const ruleTesterInstance = new RuleTester({ parserOptions: { ecmaVersion: 2021 } });

ruleTesterInstance.run('no-eslint-disable', ruleUnderTest, {
  valid: [
    '// eslint-disabl no-global-assign',
    '// eslint-disable-no-global-assign',
    '// plain text comment',
    '/* plain text multi-line \n comment */',
    '// eslint-disable-next-line-no-global-assign',
    '/*  */',
  ],
  invalid: [
    {
      code: 'let a = 10; \n // eslint-disable-next-line \n require("fs")',
      errors: [{
        message: 'Avoid inline eslint rules disabling.',
        line: 2,
        column: 2,
        endLine: 2,
        endColumn: 30,
      }],
      filename: 'sample.ts',
    },
    {
      code: '//eslint-disable-next-line',
      errors: 1,
      filename: 'sample.ts',
    },
    {
      code: '// eslint-disable-next-line',
      errors: 1,
      filename: 'sample.ts',

    },
    {
      code: '// eslint-disable',
      errors: 1,
      filename: 'sample.ts',
    },
    {
      code: `// eslint-disable \n const dummy=(i)=> i
      (async ()=>{
        for(let i=0;i<10;i++){
          await dummy(i);
        }
      })()`,
      errors: 1,
      filename: 'sample.ts',
    },
  ],
});
