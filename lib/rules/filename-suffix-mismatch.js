const {
  allowedNamingPattern,
  escapedSep,
} = require('../../constants');
const { fileContext, executionContext } = require('../../helper');

const ignoredResources = {
  frontend: ['slices', 'styles', 'utils', 'shared', 'pages', 'roq-ui', 'configuration'],
  backend: [],
};
/* Return values are as follows:
  0 for No mismatch
  1 for partial mismatch
  2 for complete mismatch
*/
const checkSuffixMismatch = (file, parentDirectory) => {
  let parentDir;
  if (typeof parentDirectory === 'string') {
    parentDir = {
      type: {
        camelCased: '', pascalCased: '', dotSeparated: '', hyphenSeparated: '',
      },
    };
    parentDir.type = fileContext.getFormattedNames(fileContext.getWordsFromCaseDifferedStrings(parentDirectory));
  } else if (!Array.isArray(parentDirectory) && typeof parentDirectory === 'object') {
    parentDir = { ...parentDirectory };
  } else {
    throw new Error('Invalid parent directory parameter either instance of parentDir from fileContext helper or a string allowed');
  }
  let expectedFileName = [`${file.resourceName.hyphenSeparated}.${parentDir.type.dotSeparated}${file.extension}`];

  const mismatchType = (file.resourceType.hyphenSeparated === parentDir.type.hyphenSeparated ? 0
    : (file.resourceType.hyphenSeparated.endsWith(parentDir.type.hyphenSeparated) ? 1 : 2));

  if (mismatchType === 1) { // For partial mismatch
    const extendedResourceName = `${file.resourceName.hyphenSeparated}-${file.resourceType.dotSeparated.replace(`.${parentDir.type.dotSeparated}`, '').replace(/\./g, '-')}`;
    expectedFileName = [`${extendedResourceName}.${parentDir.type.dotSeparated}${file.extension}`];
  }
  // check for cases where suffix is separated via '-' and not '.' example use-locale-hook.tsx
  if (mismatchType === 2 && file.resourceName.hyphenSeparated.includes(parentDir.type.hyphenSeparated)) {
    const trimmedResourceName = `${file.resourceName.hyphenSeparated.replace(`-${parentDir.type.hyphenSeparated}`, '')}`;
    expectedFileName = [`${trimmedResourceName}.${parentDir.type.dotSeparated}${file.extension}`];
  }
  return { mismatchType, expectedFileName };
};

module.exports = {
  meta: {
    type: 'layout',
    messages: {
      regularSuffixMismatch: 'Invalid filename suffix. It should be just their parent directory name(lowercased, dot separated, in singular form). Suggested renames include the following:\n {{expectedFileName}}',
      exceptionalSuffixMismatch: 'Invalid filename suffix. It should be just "{{parentType}}". Suggested renames include the following:\n {{expectedFileName}}',
    },
    docs: {
      description: 'Each file name must be suffixed with the correct type of resource they represent (which can generally be derived using the directory they reside in)',
      category: 'Stylistic Issues',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/nv_z-filename-suffix-mismatch',
    },
    schema: [],
  },
  create(context) {
    const {
      backendBasePattern,
      pathPatterns,
      frontendBasePattern,
      backendTestsPattern,
    } = executionContext.get(context);
    const errorReportObject = {
      messageId: 'regularSuffixMismatch',
      data: {},
    };
    const { file, parentDir } = fileContext.get(context);
    const dirPath = parentDir.absolutePath;
    // ignore source directories for each project and backend test(s) directories.
    const ignoredPaths = [new RegExp(`${backendBasePattern}$`),
      new RegExp(`${frontendBasePattern}$`),
      new RegExp(`${backendTestsPattern}`),
      new RegExp(`^(${backendBasePattern}).*(${escapedSep}config)$`),
    ];
    for (const segment in ignoredResources) {
      if (Object.prototype.hasOwnProperty.call(ignoredResources, segment)) {
        ignoredPaths.push(...ignoredResources[segment].map((e) => new RegExp(pathPatterns[segment][e], 'g')));
      }
    }
    const isIgnored = ignoredPaths.some((e) => e.test(dirPath));
    const isIndexFile = file.name === 'index.ts' || file.name === 'index.tsx';
    let isExceptionalMismatch = false;
    let parentType = '';

    if (!isIgnored && !isIndexFile) {
      let { mismatchType, expectedFileName } = checkSuffixMismatch(file, parentDir);

      /* Handling the exceptional cases
      1) files in root of backendModules should have a suffix "module"
      2) react-hooks should have a suffix "hook".
      3) in frontend layouts should have a suffix "layout".
      4) in frontend views should have a suffix "view".
      5) in dtos allow both "arg-type" and "dto" as suffix
      6) in frontend components should have a suffix "component".
      */

      const isBackendModuleRoot = executionContext.isBackendModule(dirPath);
      const isDTO = (new RegExp(pathPatterns.backend.dtos, 'g')).test(dirPath);
      const isReactHook = new RegExp(`${[pathPatterns.frontend['roq-hooks'], allowedNamingPattern].join(escapedSep)}$`).test(dirPath);
      const isLayout = (new RegExp(`${[pathPatterns.frontend.layouts, allowedNamingPattern].join(escapedSep)}$`)).test(dirPath);
      const isView = (new RegExp(`${[pathPatterns.frontend.views, allowedNamingPattern].join(escapedSep)}$`)).test(dirPath);
      const isComponent = (new RegExp(`${[pathPatterns.frontend.components, allowedNamingPattern].join(escapedSep)}$`)).test(dirPath);

      if (isComponent) {
        parentType = 'component';
        const suffixCheck = checkSuffixMismatch(file, parentType);
        mismatchType = suffixCheck.mismatchType;
        if (mismatchType) {
          expectedFileName = suffixCheck.expectedFileName;
          isExceptionalMismatch = true;
        }
      } else if (isBackendModuleRoot) { // type has to be module
        parentType = 'module';
        const suffixCheck = checkSuffixMismatch(file, parentType);
        mismatchType = suffixCheck.mismatchType;
        if (mismatchType) {
          expectedFileName = suffixCheck.expectedFileName;
          isExceptionalMismatch = true;
        }
      } else if (isReactHook) {
        parentType = 'hook';
        const hookSuffixCheck = checkSuffixMismatch(file, parentType);
        mismatchType = hookSuffixCheck.mismatchType;
        if (mismatchType !== 0) {
          expectedFileName = hookSuffixCheck.expectedFileName;
          isExceptionalMismatch = true;
        }
      } else if (isLayout) {
        parentType = 'layout';
        const layoutSuffixCheck = checkSuffixMismatch(file, parentType);
        mismatchType = layoutSuffixCheck.mismatchType;
        if (mismatchType !== 0) {
          expectedFileName = layoutSuffixCheck.expectedFileName;
          isExceptionalMismatch = true;
        }
      } else if (isView) {
        parentType = 'view';
        const viewSuffixCheck = checkSuffixMismatch(file, parentType);
        mismatchType = viewSuffixCheck.mismatchType;
        if (mismatchType !== 0) {
          expectedFileName = viewSuffixCheck.expectedFileName;
          isExceptionalMismatch = true;
        }
      } else if (isDTO && mismatchType !== 0 && mismatchType !== 1) {
        // if not 'dto' then we can only have argType suffix
        const argTypeSuffixCheck = checkSuffixMismatch(file, 'argType');
        mismatchType = argTypeSuffixCheck.mismatchType;
        if (mismatchType !== 0) {
          expectedFileName = [...argTypeSuffixCheck.expectedFileName, ...(argTypeSuffixCheck.expectedFileName.map((e) => e.replace('arg.type', 'dto')))];
        }
      }

      if (mismatchType) {
        errorReportObject.data.expectedFileName = expectedFileName;
        if (isExceptionalMismatch) {
          errorReportObject.messageId = 'exceptionalSuffixMismatch';
          errorReportObject.data.parentType = parentType;
        }
        return {
          Program(node) {
            context.report({
              node, ...errorReportObject,
            });
          },
        };
      }
    }

    return {};
  },
};
