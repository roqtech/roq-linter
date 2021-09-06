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
        const lastPartOfImportPath = importPathParts.length > 0 ? importPathParts[importPathParts.length - 1] : '';
        const dotSeparatedLastPart = lastPartOfImportPath.split('.');
        const firstSectionOfLastPartOfImportPath = dotSeparatedLastPart.length <= 2 ? dotSeparatedLastPart[0] : dotSeparatedLastPart.slice(0, dotSeparatedLastPart.length - 1).join('.');
        if (node.source && (node.source.value.startsWith('..') || node.source.value.startsWith('.'))) {
          context.report({
            node,
            message: 'Use absolute path instead of relative.',
          });
        }
        if (node.source && firstSectionOfLastPartOfImportPath === 'index') {
          context.report({
            node,
            message: 'Omit index in import.',
          });
        }
      },
    };
  },
};
