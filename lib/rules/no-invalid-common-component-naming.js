const {
  escapedSep, sep, allowedNamingPattern,
} = require('../../constants');

const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'layout',
    messages: {
      missingComponentPrefix: 'Filename should be prefixed with the component name. Possibly could be renamed to one of the following :\n {{expectedFileName}}',
      typeDetectedInFileName: 'Types are not expected for common-component filenames. Found {{type}}',
    },
    docs: {
      description: 'Checks that the filenames are prefixed with component name and do not have a type as in our general naming convention. So they should have a pattern : {any-component}-{sub-view}.tsx',
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
    const isCommonComponent = new RegExp(`${[pathPatterns.frontend['roq-ui'], allowedNamingPattern].join(escapedSep)}$`).test(dirPath) && file.extension === '.tsx' && file.nameWithoutExt !== 'index';
    const reportingObj = {};
    if (isCommonComponent && !file.name.startsWith(parentDir.type.hyphenSeparated)) {
      reportingObj.Program = (node) => {
        if (!relatedComponents || !relatedComponents.includes(parentDir.absolutePath.split(sep).slice(-1)[0])) {
          context.report({
            node,
            messageId: 'missingComponentPrefix',
            data: {
              expectedFileName: `${parentDir.type.hyphenSeparated}-${file.name}`,
            },
          });
        }
        if (file.resourceType.dotSeparated !== '') { // if type is found in filename, it should be reported
          context.report({
            node,
            messageId: 'typeDetectedInFileName',
            data: {
              type: file.resourceType.dotSeparated,
            },
          });
        }
      };
    }
    return reportingObj;
  },
};
