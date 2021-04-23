const {
  escapedSep,
} = require('../../constants');
const { fileContext, executionContext } = require('../../helper');

/* what we want to cover
1) default export name should match the directory name and suffixed with 'Page'.
*/
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Default page exports should be named like [{DirectoryName}Page]',
      category: 'Stylistic Issues',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/OcQv-no-invalid-page-resource',
    },
    messages: {
      missingOrExtraDefaultExport: 'Exactly one default export is expected, named as {{expectedPageName}}',
      invalidPageResource: 'Default Export name should match parent directory name (when pascalCased). Expected {{expectedPageName}}',
    },
    schema: [],
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const reportingObj = {};
    const { file, parentDir } = fileContext.get(context);
    const dirPath = parentDir.absolutePath;

    const isPage = new RegExp(pathPatterns.frontend.pages, 'g').test(dirPath);
    const ignoredPath = new RegExp([pathPatterns.frontend.pages, 'api'].join(escapedSep), 'g').test(dirPath);
    const isIndexFile = file.name === 'index.tsx';
    const ruleExecutionRequired = isPage && !ignoredPath && isIndexFile;
    const expectedPageName = `${parentDir.rawType.pascalCased}Page`;

    if (ruleExecutionRequired) {
      reportingObj.Program = (node) => {
        const defaultDeclarations = node.body.filter((e) => e.type === 'ExportDefaultDeclaration');
        if (defaultDeclarations.length !== 1) {
          context.report({
            node,
            messageId: 'missingOrExtraDefaultExport',
            data: {
              expectedPageName,
            },
          });
        } else if (defaultDeclarations[0].declaration.name !== expectedPageName) {
          context.report({
            node: defaultDeclarations[0],
            messageId: 'invalidPageResource',
            data: {
              expectedPageName,
            },
          });
        }
      };
    }
    return reportingObj;
  },
};
