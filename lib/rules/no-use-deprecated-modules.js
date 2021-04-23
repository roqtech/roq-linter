const { fileContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Avoid usage of deprecated modules',
      category: 'Best Practices',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/bcCr-no-use-deprecated-modules',
    },
    schema: [
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
  },
  create(context) {
    const deprecatedModules = context.options[0] || [];
    const { file } = fileContext.get(context);
    if (file.extension.includes('ts')) {
      return {
        ImportDeclaration(node) {
          const importValue = node.source.value;
          for (const module of deprecatedModules) {
            if (importValue === module) {
              context.report({
                loc: node.source.loc,
                message: 'Avoid usage of deprecated modules.',
              });
            }
          }
        },
      };
    }
    return {};
  },
};
