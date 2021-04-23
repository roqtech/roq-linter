const {
  escapedSep,
} = require('../../constants');

const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'layout',
    messages: {
      invalidSeparatorPattern: 'Unexpected filename. It should match the following pattern : {any-name}.{any.type}.extension',
    },
    docs: {
      description: 'Filenames should match the following pattern : {any-name}.{any.type}.extension',
      category: 'Stylistic Issues',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/uRq3-no-invalid-filename-pattern',
    },
    schema: [],
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { file, parentDir } = fileContext.get(context);
    const dirPath = parentDir.absolutePath;
    const firstDotIndexInName = file.nameWithoutExt.indexOf('.');
    const lastHyphenIndexInName = file.nameWithoutExt.lastIndexOf('-');

    const ignoredPaths = [new RegExp([pathPatterns.frontend.pages, 'api'].join(escapedSep), 'g')];

    const isIgnored = ignoredPaths.some((e) => e.test(dirPath));

    if (!isIgnored) {
      if (lastHyphenIndexInName !== -1 && firstDotIndexInName !== -1
        && lastHyphenIndexInName > firstDotIndexInName) {
        return {
          Program(node) {
            context.report({
              node,
              messageId: 'invalidSeparatorPattern',
            });
          },
        };
      }
    }

    return {};
  },
};
