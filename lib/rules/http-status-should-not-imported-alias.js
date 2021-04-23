module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'HttpStatus should not be import using alias',
      category: 'Possible Errors',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/zmg2-http-status-should-not-imported-alias',
    },
    schema: [],
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const { specifiers } = node;
        if (specifiers.some((specifier) => specifier.imported && specifier.imported.name === 'HttpStatus' && specifier.local.name !== specifier.imported.name)) {
          context.report({
            node,
            message: 'HttpStatus should not be import using alias',
          });
        }
      },
    };
  },
};
