const { sep, allowedNamingPattern, escapedSep } = require('../../constants');
const { fileContext, executionContext } = require('../../helper');

const InvalidComponentsDirReported = [];

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'A few resources like components and partials, should have their own separate directory and each file in this directory (except index) must match the name of this directory',
      category: 'Best Practices',
      url: '', // to do add link to documentation
    },
    schema: [],
  },
  create(context) {
    const {
      pathPatterns,
      resourceRegex,
      frontendBasePattern,
    } = executionContext.get(context);
    const { file, parentDir } = fileContext.get(context);
    const dirPath = parentDir.absolutePath;
    const dirPathPartTokens = dirPath.split(sep);
    if (InvalidComponentsDirReported.includes(dirPath)) {
      return {};
    }
    const rawDirName = dirPath.split(sep).slice(-1)[0];
    const fileHasComponentSuffix = file.nameWithoutExt.endsWith('.component');
    const fileHasPartialSuffix = file.nameWithoutExt.endsWith('.partial');
    const isComponent = resourceRegex.component.some((e) => e.test(dirPath));
    const isPartial = resourceRegex.partial.some((e) => e.test(dirPath));

    const isComponentsDirectoryAtExpectedLocation = new RegExp(`^${[frontendBasePattern, 'modules', allowedNamingPattern, 'components'].join(escapedSep)}`).test(dirPath);

    const isPartialsDirectoryAtExpectedLocation = [
      new RegExp(`^${[pathPatterns.frontend.moduleDir.components, 'partials'].join(escapedSep)}`),
      new RegExp(`^${[pathPatterns.frontend.layouts, allowedNamingPattern, 'partials'].join(escapedSep)}`),
      new RegExp(`^${[pathPatterns.frontend.views, allowedNamingPattern, 'partials'].join(escapedSep)}`),
    ].some((e) => e.test(dirPath));

    return {
      Program(node) {
        if (new RegExp(`${[pathPatterns.frontend.layouts, allowedNamingPattern, 'components'].join(escapedSep)}`).test(dirPath)) {
          InvalidComponentsDirReported.push(dirPath);
          context.report({
            node,
            message: 'Layouts should have partials instead of components. A good start to fix this could be to rename super parent "components" dir to "partials"',
          });
        }
        if ((fileHasComponentSuffix && !isComponent)) {
          context.report({
            node,
            message: 'All components and their related styles should be placed in their own directory (.../components/{component-name}/{component-name}.component.tsx)',
          });
        }
        if ((fileHasPartialSuffix && !isPartial)) {
          context.report({
            node,
            message: 'All partials and their related styles should be placed either in their own directory (.../partials/{partial-name}/{partial-name}.partial.tsx)',
          });
        }
        if ((fileHasPartialSuffix || fileHasComponentSuffix) && file.nameWithoutExt.split('.')[0] !== rawDirName) {
          context.report({
            node,
            message: 'The file-name and the parent directory name should match',
          });
        }
        if (dirPathPartTokens.includes('components') && !isComponentsDirectoryAtExpectedLocation) {
          context.report({
            node,
            message: 'Components directory can only exist at the following path pattern modules/*/components',
          });
        } else if (dirPathPartTokens.includes('partials') && !isPartialsDirectoryAtExpectedLocation) {
          context.report({
            node,
            message: 'The partials directory can only exist at the path pattern [views, layouts, components]/*/partials',
          });
        }
      },
    };
  },
};
