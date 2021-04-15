module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Destructuring import is not allowed',
      category: 'Best Practices',
      url: 'https://docs.roq.tech/lodash-destructuring-import-is-not-allowed',
    },
    schema: [], // no options
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source && node.source.value.startsWith('lodash') && node.specifiers.length > 0) {
          const specifier = node.specifiers[0];
          const parts = node.source.value.split('/');

          if (parts.length === 1 || !specifier.local.name.endsWith(parts[parts.length - 1])) {
            context.report({
              node,
              message: 'Destructuring import is not allowed. Use only direct default import of functions.',
            });
          }
        }
      },
    };
  },
};
