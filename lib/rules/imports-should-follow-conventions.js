const fs = require('fs');
const {
  possibleFileExtensions, escapedSep,
} = require('../../constants');
const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Imports should follow conventions',
      category: 'Stylistic Issues',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/Mavr-imports-should-follow-conventions',
    },
    schema: [], // no options
  },
  create(context) {
    const {
      frontendBasePattern,
    } = executionContext.get(context);
    return {
      ImportDeclaration(node) {
        const importPathParts = node.source ? node.source.value.split('/') : [];
        const lastPartOfImportPath = importPathParts.length > 0 ? importPathParts[importPathParts.length - 1] : '';
        const dotSeparatedLastPart = lastPartOfImportPath.split('.');
        const firstSectionOfLastPartOfImportPath = dotSeparatedLastPart.length <= 2 ? dotSeparatedLastPart[0] : dotSeparatedLastPart.slice(0, dotSeparatedLastPart.length - 1).join('.');
        if (node.source && (node.source.value.startsWith('..') || node.source.value.startsWith('.'))) {
          context.report({
            node,
            message: 'Use absolute path instead of relative.',
          });
        }
        if (node.source && firstSectionOfLastPartOfImportPath === 'index') {
          context.report({
            node,
            message: 'Omit index in import.',
          });
        }
        if (node.source && node.source.value) {
          const pathToImportFrom = node.source.value;
          let basePathStats = null;
          try { basePathStats = fs.statSync(pathToImportFrom); } catch (err) { /* DO NOTHING */ }
          let isFile = false;
          if (basePathStats && basePathStats.isFile()) {
            isFile = true;
          } else if (!basePathStats) {
            for (const ext of possibleFileExtensions) {
              try { basePathStats = fs.statSync(pathToImportFrom + ext); } catch (err) { /* DO NOTHING */ }
              if (basePathStats) {
                isFile = true;
                break;
              }
            }
          }
          if (isFile) {
            context.report({
              node,
              message: 'Imports should happen from a shared resource directory instead of directly from the resource file.',
            });
          }
          const partialsPositionInImportPath = importPathParts.findIndex((elem) => elem === 'partials');
          if (partialsPositionInImportPath !== -1) {
            const baseDirOfImportedPartial = importPathParts.slice(0, partialsPositionInImportPath).join(escapedSep);
            const { parentDir } = fileContext.get(context);
            const isPartialImportedInSameBaseDirectory = new RegExp(`^${frontendBasePattern}${escapedSep}${baseDirOfImportedPartial}`).test(parentDir.absolutePath);
            if (!isPartialImportedInSameBaseDirectory) {
              context.report({
                node,
                message: 'Importing partials from outside the parent view/component is disallowed',
              });
            }
          }
        }
      },
    };
  },
};
