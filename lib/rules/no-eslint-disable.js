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
            const [firstToken, ...remainingTokens] = commentToken.value.trim().split(' ');
            const firstWord = firstToken.trim();
            if ((firstWord === 'eslint-disable' || firstWord === 'eslint-disable-next-line') && (remainingTokens.length === 0 || remainingTokens.some((e) => e.trim().startsWith('@roq/')))) {
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
