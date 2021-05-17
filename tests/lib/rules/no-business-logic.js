const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-business-logic');

const ruleTesterInstance = new RuleTester({
  parserOptions: { ecmaVersion: 2021 },
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTesterInstance.run('no-business-logic', ruleUnderTest, {
  valid: [
    {
      code: '@InputType()\n'
        + 'export class anyDto {\n'
        + '  @Field()\n'
        + '  @IsString()\n'
        + '  anyValue: string;\n'
        + '}',
      filename: 'backend/src/auth/dtos/auth-register.dto.ts',
    },
    {
      code: '@Entity()\n'
        + 'export class anyEntity {\n'
        + '   @BeforeInsert()\n'
        + '   convertToJson(): void {\n'
        + '     if (this.parameters) this.parameters = JSON.parse(this.parameters);\n'
        + '   }\n'
        + '}',
      filename: 'backend/src/auth/entities/refresh-token.entity.ts',
    },
  ],
  invalid: [
    {
      code: '@InputType()\n'
        + 'export class anyDto {\n'
        + '  @Field()\n'
        + '  @IsString()\n'
        + '  anyValue: string;\n'
        + '}\n'
        + '\n'
        + 'const testArray = [1, 2, 3]\n'
        + 'for(const testVar of testArray) {\n'
        + '  console.log(testVar)\n'
        + '}',
      errors: [{ message: 'This file must not contain any business logic' }],
      filename: 'backend/src/auth/dtos/auth-register.dto.ts',
    },
  ],
});
