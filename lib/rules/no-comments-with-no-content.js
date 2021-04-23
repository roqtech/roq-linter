const { fileContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Comments without content are not allowed',
      category: 'Stylistic Issues',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/3Tf3-no-comments-with-no-content',
    },
    schema: [], // no options
  },
  create(context) {
    const { file } = fileContext.get(context);
    if (file.extension.includes('ts')) { // works for both .ts and .tsx
      const sourceCode = context.getSourceCode();
      const comments = sourceCode.getAllComments();

      return {
        Program() {
          for (const comment of comments) {
            if ((comment.value.trim()).length === 0) {
              context.report({
                loc: comment.loc,
                message: 'Comments without content are not allowed',
              });
            }
          }
        },
      };
    }

    return {};
  },
};
