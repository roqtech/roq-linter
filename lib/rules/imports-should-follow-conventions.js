module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Imports should follow conventions',
      category: 'Stylistic Issues',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/Mavr-imports-should-follow-conventions',
    },
    schema: [], // no options
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importPathParts = node.source ? node.source.value.split('/') : [];
        if (node.source && node.source.value.startsWith('..')) {
          context.report({
            node,
            message: 'Use absolute path instead of relative.',
          });
        }
        if (node.source && importPathParts.length > 0 && importPathParts[importPathParts.length - 1].startsWith('index')) {
          context.report({
            node,
            message: 'Omit index in import.',
          });
        }
      },
    };
  },
};
