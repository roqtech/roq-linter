const { fileContext, executionContext } = require('../../helper');

const allowedDecorators = ['ResolveField', 'Query', 'Mutation'];

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Resolver methods should be marked with either "ResolveField", "Query", "Mutation" decorator',
      category: 'Possible Errors',
      url: 'https://docs.roq.tech/no-disallowed-function-decorators',
    },
    schema: [],
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { file, parentDir } = fileContext.get(context);
    const dirPath = parentDir.absolutePath;

    const isResolver = new RegExp(pathPatterns.backend.resolvers).test(dirPath);
    const isIndexFile = file.name === 'index.ts' || file.name === 'index.tsx';

    function resolverHandler(node) {
      if (!node.decorators) {
        context.report({
          node,
          message: 'Methods in resolvers should have either one of these decorators {{allowedDecorators}}',
          data: {
            allowedDecorators,
          },
        });
      } else {
        const hasAllowedDecorators = node.decorators.some(
          (e) => allowedDecorators.includes(e.expression.callee.name),
        );
        if (!hasAllowedDecorators) {
          context.report({
            node,
            message: 'Methods in resolvers should have either one of these decorators {{allowedDecorators}}',
            data: {
              allowedDecorators,
            },
          });
        }
      }
    }

    if (isResolver && !isIndexFile) {
      return {
        'ClassDeclaration[decorators.0.expression.callee.name="Resolver"] MethodDefinition[kind = "method"]': resolverHandler
        ,
      };
    }
    return {};
  },
};
