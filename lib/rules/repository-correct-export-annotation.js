const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Current file should export a class annotated with @EntityRepository',
      category: 'Possible Errors',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/Nxq--repository-correct-export-annotation',
    },
    schema: [],
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { parentDir } = fileContext.get(context);
    const isRepository = (new RegExp(pathPatterns.backend.repositories, 'g')).test(parentDir.absolutePath);

    return {
      ClassDeclaration(node) {
        if (isRepository) {
          const { decorators = [] } = node;
          if (!decorators.length || decorators.every((decorator) => decorator.expression.callee.name !== 'EntityRepository')) {
            context.report({
              node,
              message: 'Current file should export a class annotated with @EntityRepository',
            });
          }
        }
      },
    };
  },
};
