const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Current file should export a class annotated with @ObjectType decorator',
      category: 'Possible Errors',
      url: 'https://docs.roq.tech/exports-should-object-type-decorator',
    },
    schema: [],
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { parentDir } = fileContext.get(context);
    const isModel = (new RegExp(pathPatterns.backend.models, 'g').test(parentDir.absolutePath));

    return {
      ClassDeclaration(node) {
        if (isModel) {
          const { decorators = [] } = node;
          if (!decorators.length || decorators.every((decorator) => decorator.expression.callee.name !== 'ObjectType')) {
            context.report({
              node,
              message: 'Current file should export a class annotated with @ObjectType decorator',
            });
          }
        }
      },
    };
  },
};
