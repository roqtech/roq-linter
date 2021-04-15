module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: '"ParseUUIDPipe should be in @Args decorators”',
      url: 'https://docs.roq.tech/resolvers-parse-id',
    },
    schema: [],
  },
  create(context) {
    return {
      MethodDefinition(node) {
        if (node.parent && node.parent.type === 'ClassBody' && node.parent.parent.decorators
              && node.parent.parent.decorators[0].expression.type === 'CallExpression'
              && node.parent.parent.decorators[0].expression.callee.name === 'Resolver'
              && node.value.type === 'FunctionExpression' && node.value.params.length
        ) {
          const param = node.value.params.find((par) => par.name === 'id');
          if (param) {
            const { decorators } = node.value.params[0];
            if (decorators && decorators.length) {
              const args = decorators[0].expression.arguments;
              const exist = args.find((a) => a.type === 'Identifier' && a.name === 'ParseUUIDPipe');
              if (!exist) {
                context.report({
                  node,
                  loc: decorators[0].expression.callee.loc,
                  message: 'ParseUUIDPipe is not found in @Args decorators',
                });
              }
            }
          }
        }
      },
    };
  },
};
