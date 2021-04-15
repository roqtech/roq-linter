const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/repository-correct-export-annotation');

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

ruleTesterInstance.run('repository-correct-export-annotation', ruleUnderTest, {
  valid: [{
    code: `
      @EntityRepository(EventSubscriberEntity)
      export class EventSubscriberRepository{}
    `,
    filename: 'backend/src/event/repositories/event-subscriber.repository.ts',
  }],
  invalid: [{
    code: `
      @Entity()
      export class EventSubscriberRepository {
        @Field(() => ID)
        id: string;
      }
    `,
    errors: [{ message: 'Current file should export a class annotated with @EntityRepository' }],
    filename: 'backend/src/event/repositories/event-subscriber.repository.ts',
  }],
});
