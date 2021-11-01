const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Current file should export a class annotated with @Entity decorator',
      category: 'Possible Errors',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/UiCK-exports-should-entity-decorator',
    },
    messages: {
      invalidDatabaseName: 'The value for the "name" parameter should be {{expectedTableName}} as it should match the snake cased file name',
      missingNameParam: 'The @Entity decorator should have a "name" parameter with value {{expectedTableName}} to specify the database table name',
      missingEntityDecorator: 'Current file should export class annotated with @Entity decorator',
      literalValuesOnly: 'The value for the "name" parameter should be a literal',
    },
    schema: [], // no options
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { file, parentDir } = fileContext.get(context);
    const isEntity = (new RegExp(pathPatterns.backend.entities, 'g')).test(parentDir.absolutePath);

    return {
      ClassDeclaration(node) {
        if (isEntity) {
          let entityDecoratorFound = false;
          let entityNameParamProvided = false;
          if (node.decorators) {
            for (const decorator of node.decorators) {
              const { name, loc } = decorator.expression.callee;
              if (name === 'Entity') {
                entityDecoratorFound = true;
                if (decorator.expression.arguments && decorator.expression.arguments.length > 0) {
                  for (const arg of decorator.expression.arguments) {
                    if (arg.type === 'ObjectExpression') {
                      for (const property of arg.properties) {
                        if (property.type === 'Property' && property.key.name === 'name') {
                          entityNameParamProvided = true;
                          if (property.value) {
                            const snakeCasedFileName = file.resourceName.snakeCased;
                            if (property.value.type === 'Literal') {
                              if (property.value.value !== snakeCasedFileName) {
                                context.report({
                                  loc: property.value.loc,
                                  messageId: 'invalidDatabaseName',
                                  data: {
                                    expectedTableName: snakeCasedFileName,
                                  },
                                });
                              }
                            } else {
                              context.report({
                                loc: property.value.loc,
                                messageId: 'literalValuesOnly',
                              });
                            }
                          }
                        }
                      }
                    }
                  }
                }
                if (!entityNameParamProvided) {
                  context.report({
                    loc,
                    messageId: 'missingNameParam',
                    data: {
                      expectedTableName: file.resourceName.snakeCased,
                    },
                  });
                }
              }
            }
          }

          if (!entityDecoratorFound) {
            context.report({
              node,
              messageId: 'missingEntityDecorator',
            });
          }
        }
      },
    };
  },
};
