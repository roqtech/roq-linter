const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Current file should export a class annotated with @Schema decorator',
      category: 'Possible Errors',
      url: 'https://docs.roq.tech/exports-should-schema-decorator',
    },
    schema: [], // no options
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { file, parentDir } = fileContext.get(context);
    const isSchema = (new RegExp(pathPatterns.backend.schemas, 'g')).test(parentDir.absolutePath);

    return {
      ClassDeclaration(node) {
        if (isSchema && file.name !== 'index.ts') {
          if (node.decorators) {
            const { name, loc } = node.decorators[0].expression.callee;
            if (name !== 'Schema') {
              context.report({
                loc,
                message: 'Current file should export class annotated with @Schema decorator',
              });
            }
          } else if (isSchema && !node.decorators) {
            context.report({
              node,
              message: 'Current file should export a class annotated with @Schema decorator',
            });
          }
        }
      },
    };
  },
};
