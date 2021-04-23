const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Current file should export a class annotated with @Entity decorator',
      category: 'Possible Errors',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/UiCK-exports-should-entity-decorator',
    },
    schema: [], // no options
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { parentDir } = fileContext.get(context);
    const isEntity = (new RegExp(pathPatterns.backend.entities, 'g')).test(parentDir.absolutePath);

    return {
      ClassDeclaration(node) {
        if (isEntity && node.decorators) {
          const { name, loc } = node.decorators[0].expression.callee;
          if (name !== 'Entity') {
            context.report({
              loc,
              message: 'Current file should export class annotated with @Entity decorator',
            });
          }
        } else if (isEntity && !node.decorators) {
          context.report({
            node,
            message: 'Current file should export class annotated with @Entity decorator',
          });
        }
      },
    };
  },
};
