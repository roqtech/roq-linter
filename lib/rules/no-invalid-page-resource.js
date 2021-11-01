const {
  escapedSep,
  sep,
} = require('../../constants');
const { fileContext, executionContext } = require('../../helper');

/* what we want to cover
1) The page should default export a view whose name should match the directory name and should be suffixed with 'View'.
*/
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Default page exports should be named like [{DirectoryName}View]',
      category: 'Stylistic Issues',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/OcQv-no-invalid-page-resource',
    },
    messages: {
      missingOrExtraDefaultExport: 'Exactly one default export is expected, named as {{expectedViewName}}',
      invalidPageResource: 'Default Export name should match parent directory name (when pascalCased) and suffixed with "View". Expected {{expectedViewName}}',
      invalidNestedPageResource: 'Default Export name in case of nested pages, can only include directory names in order (when pascalCased, ignoring directory names enclosed in []).',
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
    const dirPathParts = dirPath.split(sep);
    const dirName = dirPathParts.slice(-1)[0];

    const isPage = new RegExp(pathPatterns.frontend.pages, 'g').test(dirPath);
    const ignoredPath = new RegExp([pathPatterns.frontend.pages, 'api'].join(escapedSep), 'g').test(dirPath);
    const isIndexFile = file.name === 'index.tsx';
    const isHomePage = new RegExp(`${pathPatterns.frontend.pages}$`).test(dirPath);
    const ruleExecutionRequired = isPage && !ignoredPath && isIndexFile;
    let expectedViewName = `${parentDir.rawType.pascalCased}View`;

    if (ruleExecutionRequired) {
      expectedViewName = isHomePage ? 'HomeView' : expectedViewName;
      const checkPagesDirIndex = (name) => name === 'pages';
      const pagesDirIndex = dirPathParts.findIndex(checkPagesDirIndex);
      let pagesPathArr = dirPathParts.slice(pagesDirIndex + 1);

      if (pagesPathArr[0] === 'components') {
        pagesPathArr = pagesPathArr.slice(1);
      }

      const checkDirNameIndex = (element) => element === dirName;
      const isNestedPageResource = pagesPathArr.findIndex(checkDirNameIndex) >= 1;

      reportingObj.Program = (node) => {
        const defaultDeclarations = node.body.filter((e) => e.type === 'ExportDefaultDeclaration');
        if (defaultDeclarations.length !== 1) {
          context.report({
            node,
            messageId: 'missingOrExtraDefaultExport',
            data: {
              expectedViewName,
            },
          });
        } else if (isNestedPageResource) {
          const orderedDirectorySequence = [];
          pagesPathArr.forEach((dir) => {
            if (!dir.startsWith('[') && !dir.endsWith(']')) {
              orderedDirectorySequence.push(
                ...(fileContext.getWordsFromCaseDifferedStrings(dir).map(
                  (word) => word.charAt(0).toUpperCase() + word.slice(1),
                )),
              );
            }
          });
          orderedDirectorySequence.push('View'); // this is for efficient name matching
          const exportedPageName = defaultDeclarations[0].declaration.name;
          const wordsInExportedName = exportedPageName.split(/(?=[A-Z])/);
          let previousWordAtIndex = 0;
          const isInvalidName = !exportedPageName.endsWith('View') || wordsInExportedName.length <= 1 || wordsInExportedName.some((word) => {
            previousWordAtIndex = orderedDirectorySequence.indexOf(word, previousWordAtIndex);
            return previousWordAtIndex === -1;
          });
          if (isInvalidName) {
            context.report({
              node: defaultDeclarations[0],
              messageId: 'invalidNestedPageResource',
            });
          }
        } else if (defaultDeclarations[0].declaration.name !== expectedViewName) {
          context.report({
            node: defaultDeclarations[0],
            messageId: 'invalidPageResource',
            data: {
              expectedViewName,
            },
          });
        }
      };
    }
    return reportingObj;
  },
};
