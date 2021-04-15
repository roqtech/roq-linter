const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Current file should export a class annotated with @Scalar decorator',
      category: 'Possible Errors',
      url: 'https://docs.roq.tech/exports-should-scalar-decorator',
    },
    schema: [], // no options
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { file, parentDir } = fileContext.get(context);
    const isScalar = (new RegExp(pathPatterns.backend.scalars, 'g')).test(parentDir.absolutePath);

    return {
      ClassDeclaration(node) {
        if (isScalar && file.name !== 'index.ts') {
          if (node.decorators) {
            const { name, loc } = node.decorators[0].expression.callee;
            if (name !== 'Scalar') {
              context.report({
                loc,
                message: 'Current file should export class annotated with @Scalar decorator',
              });
            }
          } else if (isScalar && !node.decorators) {
            context.report({
              node,
              message: 'Current file should export a class annotated with @Scalar decorator',
            });
          }
        }
      },
    };
  },
};
