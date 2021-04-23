const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'This location should have only layouts',
      category: 'Best Practices',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/A6wK-only-layouts-location',
    },
    schema: [], // no options
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { file, parentDir } = fileContext.get(context);
    const isLayout = (new RegExp(pathPatterns.frontend.layouts, 'g')).test(parentDir.absolutePath);

    if (isLayout && file.name !== 'index.ts') {
      return {
        Program(node) {
          if (!file.name.includes('layout')) {
            context.report({
              node,
              message: 'This location should have only layouts',
              data: {
                dir: parentDir.absolutePath,
              },
            });
          }

          for (const item of node.body) {
            if (item.declaration && item.declaration.declarations && item.type === 'ExportNamedDeclaration') {
              if (!item.declaration.declarations[0].id.name.toLowerCase().includes('layout')) {
                const declarationLocation = item.declaration.declarations[0].id.loc;
                context.report({
                  loc: declarationLocation,
                  message: 'This location should have only layouts',
                });
              }
            }
          }
        },
      };
    }

    return {};
  },
};
