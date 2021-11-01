const {
  escapedSep, sep, allowedNamingPattern,
} = require('../../constants');

const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'layout',
    messages: {
      missingComponentPrefix: 'Filename should be prefixed with the component name. Possibly could be renamed to one of the following :\n {{expectedFileName}}',
    },
    docs: {
      description: 'Checks that the filenames are prefixed with the name of the component. So they should have a pattern : {any-component}-{sub-view}.tsx',
      category: 'Stylistic Issues',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/xpch-no-invalid-common-component-naming',
    },
    schema: [
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const relatedComponents = context.options[0];
    const { file, parentDir } = fileContext.get(context);
    const dirPath = parentDir.absolutePath;
    const isCommonComponent = new RegExp(`${[pathPatterns.frontend.moduleDir.common.components, allowedNamingPattern].join(escapedSep)}$`).test(dirPath) && file.extension === '.tsx' && file.nameWithoutExt !== 'index';
    const reportingObj = {};

    if (isCommonComponent) {
      reportingObj.Program = (node) => {
        if (!file.name.startsWith(parentDir.type.hyphenSeparated)) {
          let reportMissingComponentPrefix = true;
          if (relatedComponents
            && relatedComponents.includes(parentDir.absolutePath.split(sep).slice(-1)[0])) {
            reportMissingComponentPrefix = false;
          }
          if (reportMissingComponentPrefix) {
            context.report({
              node,
              messageId: 'missingComponentPrefix',
              data: {
                expectedFileName: `${parentDir.type.hyphenSeparated}-${file.name}`,
              },
            });
          }
        }
      };
    }
    return reportingObj;
  },
};
