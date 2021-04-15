const {
  escapedSep,
  // allowedNamingPattern,
} = require('../../constants');

const allowedNamingPattern = '[a-z0-9-.]+';
const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'layout',
    messages: {
      containsInvalidChars: 'Found disallowed characters {{invalidCharList}} in fileName. Characters in filenames should match the following regex : {{allowedNamingPattern}}',
    },
    docs: {
      description: 'Filenames should comprise of just lowercased english characters, hyphens, dots and numbers',
      category: 'Stylistic Issues',
      url: 'https://docs.roq.tech/no-invalid-char-in-filename',
    },
    schema: [],
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { file, parentDir } = fileContext.get(context);
    const dirPath = parentDir.absolutePath;
    const invalidCharList = file.nameWithoutExt.match(/[^(a-z0-9-.)]/g);

    const ignoredPaths = [new RegExp([pathPatterns.frontend.pages, 'api'].join(escapedSep), 'g')];

    const isIgnored = ignoredPaths.some((e) => e.test(dirPath));

    if (!isIgnored && invalidCharList) {
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
