const allowedNamingPattern = '[\[\]_a-z0-9-.]+';
const { fileContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'layout',
    messages: {
      containsInvalidChars: 'Found disallowed characters {{invalidCharList}} in fileName. Characters in filenames should match the following regex : {{allowedNamingPattern}}',
    },
    docs: {
      description: 'Filenames should comprise of just lowercased english characters, hyphens, dots, numbers, underscores and square brackets',
      category: 'Stylistic Issues',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/Tyvr-no-invalid-filename-chars-frontend',
    },
    schema: [],
  },
  create(context) {
    const { file } = fileContext.get(context);
    const invalidCharList = file.nameWithoutExt.match(/[^(\[\]_a-z0-9-.)]/g);

    if (invalidCharList) {
      return {
        Program(node) {
          context.report({
            node,
            messageId: 'containsInvalidChars',
            data: {
              invalidCharList,
              allowedNamingPattern: new RegExp(allowedNamingPattern),
            },
          });
        },
      };
    }

    return {};
  },
};
