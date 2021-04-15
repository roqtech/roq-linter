const { fileContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Avoid inline eslint rules disabling.',
      category: 'Best Practices',
      url: 'https://docs.roq.tech/no-eslint-disable',
    },
    schema: [], // no options
  },
  create(context) {
    const { file } = fileContext.get(context);
    if (file.extension.includes('ts')) { // works for both .ts and .tsx
      const sourceCode = context.getSourceCode();
      return {
        Program() {
          const comments = sourceCode.getAllComments();
          for (const commentToken of comments) {
            const firstWord = commentToken.value.trim().split(' ')[0].trim();
            if (firstWord === 'eslint-disable' || firstWord === 'eslint-disable-next-line') {
              context.report({
                loc: commentToken.loc,
                message: 'Avoid inline eslint rules disabling.',
              });
            }
          }
        },
      };
    }
    return {};
  },
};
