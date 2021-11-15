const { sep } = require('../../constants');
const { fileContext, executionContext } = require('../../helper');

/* what we want to cover
1) Components and Partials should export a single function component.
*/
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Components and Partials should export a single function component',
      category: 'Best Practices',
      url: '', // to do add link to documentation
    },
    messages: {
      invalidFileName: 'Filename should match the directory name. Expected {{expectedFileName}}',
      missingOrExtraNamedExport: 'Exactly one function should be defined and exported and it should be the react component',
      disallowedClassExport: 'Use function component over class component',
    },
    schema: [],
  },
  create(context) {
    const {
      resourceRegex,
    } = executionContext.get(context);
    const reportingObj = {};
    const { file, parentDir } = fileContext.get(context);
    const dirPath = parentDir.absolutePath;

    const isComponent = resourceRegex.component.some((e) => e.test(dirPath)) && file.nameWithoutExt.endsWith('.component');
    const isPartial = resourceRegex.component.some((e) => e.test(dirPath)) && file.nameWithoutExt.endsWith('.partial');
    const rawDirName = dirPath.split(sep).slice(-1)[0];

    const ruleExecutionRequired = (isComponent || isPartial);

    if (ruleExecutionRequired) {
      reportingObj.Program = (node) => {
        const exportedNamedFunctions = node.body.filter((e) => e.type === 'ExportNamedDeclaration' && e.exportKind === 'value' && e.declaration.type === 'VariableDeclaration').map((e) => e.declaration);
        if (exportedNamedFunctions.length !== 1) {
          context.report({
            node,
            messageId: 'missingOrExtraNamedExport',
          });
        }
        if (file.nameWithoutExt.split('.')[0] !== rawDirName) {
          context.report({
            node,
            messageId: 'invalidFileName',
            data: {
              expectedFileName: `${rawDirName}${isComponent ? '.component' : 'partial'}.tsx`,
            },
          });
        }
      };
      reportingObj['ExportNamedDeclaration ClassDeclaration'] = (node) => {
        context.report({
          node,
          messageId: 'disallowedClassExport',
        });
      };
    }
    return reportingObj;
  },
};
