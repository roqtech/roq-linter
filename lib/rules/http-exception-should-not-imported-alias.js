module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'HttpException should not be import using alias',
      category: 'Possible Errors',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/G5dm-http-exception-should-not-imported-alias',
    },
    schema: [],
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const { specifiers } = node;
        if (specifiers.some((specifier) => specifier.imported && specifier.imported.name === 'HttpException' && specifier.local.name !== specifier.imported.name)) {
          context.report({
            node,
            message: 'HttpException should not be import using alias',
          });
        }
      },
    };
  },
};
