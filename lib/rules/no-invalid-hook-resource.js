const {
  allowedNamingPattern,
  escapedSep,
} = require('../../constants');
const { fileContext, executionContext } = require('../../helper');

/* what we want to cover
1) exported function name should match fileName.
2) filename should have 'use' prefixed.
filename suffix is already checked.
*/
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'React hooks should follow all the defined conventions',
      category: 'Stylistic Issues',
      url: 'https://docs.roq.tech/no-invalid-hook-resource',
    },
    messages: {
      invalidFileName: 'Filename should be prefixed with "use"',
      invalidExportedHookName: 'Exported constant name should match file name. Expected {{resourceName}}',
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

    const isHook = [new RegExp(`${[pathPatterns.frontend['roq-hooks'], allowedNamingPattern].join(escapedSep)}$`), new RegExp(`${[pathPatterns.frontend.components, allowedNamingPattern, 'hooks'].join(escapedSep)}$`)].some((e) => e.test(dirPath));
    const isIndexFile = file.name === 'index.ts' || file.name === 'index.tsx';
    const fileIsUsePrefixed = file.name.startsWith('use-');
    const ruleExecutionRequired = isHook && !isIndexFile;

    const fileNameToMatch = `${file.resourceName.camelCased}`;
    const expectedHookName = fileIsUsePrefixed ? fileNameToMatch : `use${fileNameToMatch.charAt(0).toUpperCase() + fileNameToMatch.slice(1)}`;

    if (ruleExecutionRequired) {
      if (!fileIsUsePrefixed) {
        reportingObj.Program = (node) => {
          context.report({
            node,
            messageId: 'invalidFileName',
          });
        };
      }
      reportingObj.ExportNamedDeclaration = (node) => {
        if (node.declaration.type === 'VariableDeclaration' && node.declaration.kind === 'const' && node.declaration.declarations
          && node.declaration.declarations[0]
          && node.declaration.declarations[0].id.name !== expectedHookName) {
          context.report({
            node,
            messageId: 'invalidExportedHookName',
            data: {
              resourceName: expectedHookName,
            },
          });
        }
      };
    }
    return reportingObj;
  },
};
