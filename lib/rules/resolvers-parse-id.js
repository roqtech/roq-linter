module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: '"ParseUUIDPipe should be in @Args decorators”',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/d6kx-resolvers-parse-id',
    },
    schema: [],
  },
  create(context) {
    let parseUUIDPipeImportToken = null;
    let programNode = null;
    return {
      Program(node) {
        programNode = node;
      },
      ImportDeclaration(node) {
        const { specifiers } = node;
        specifiers.forEach((e) => {
          if (e.parent && e.parent.source && e.parent.source.value && e.parent.source.value === '@nestjs/common' && e.imported && e.imported.name === 'ParseUUIDPipe' && e.local && e.local.name) {
            parseUUIDPipeImportToken = e.local.name;
          }
        });
      },
      MethodDefinition(node) {
        if (node.parent && node.parent.type === 'ClassBody' && node.parent.parent.decorators
          && node.parent.parent.decorators[0].expression.type === 'CallExpression'
          && node.parent.parent.decorators[0].expression.callee.name === 'Resolver'
          && node.value.type === 'FunctionExpression' && node.value.params.length
        ) {
          const idParamIndex = node.value.params.findIndex((par) => par.name === 'id');
          if (idParamIndex !== -1) {
            if (!parseUUIDPipeImportToken) {
              context.report({
                node: programNode,
                message: 'Missing/Invalid Destructured Import for ParseUUIDPipe from @nestjs/common',
              });
            } else {
              const { decorators } = node.value.params[idParamIndex];
              if (decorators && decorators.length) {
                const args = decorators[0].expression.arguments;
                const exist = args.find((a) => a.type === 'Identifier' && a.name === parseUUIDPipeImportToken);
                if (!exist) {
                  context.report({
                    node,
                    loc: decorators[0].expression.callee.loc,
                    message: 'ParseUUIDPipe needs to be the second param in the @Args decorator',
                  });
                }
              }
            }
          }
        }
      },
    };
  },
};
