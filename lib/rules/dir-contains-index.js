const fs = require('fs');

const { fileContext, executionContext } = require('../../helper');

const dirReported = [];
const ignoredResources = {
  frontend: ['interfaces', 'roq-hooks', 'configuration', 'layouts', 'shared', 'styles', 'utils'],
  backend: ['config'],
};

module.exports = {
  meta: {
    type: 'layout',
    messages: {
      suggestion: 'Missing index.ts(x) file in {{ dir }}. Create one.',
    },
    docs: {
      description: 'The directory must contain an index file',
      category: 'Best Practices',
      url: 'https://docs.roq.tech/dir-contains-index',
    },
    schema: [], // no options
  },
  create(context) {
    const {
      backendBasePattern,
      pathPatterns,
      frontendBasePattern,
      backendTestsPattern,
    } = executionContext.get(context);
    const { parentDir } = fileContext.get(context);

    const dirPath = parentDir.absolutePath;
    if (dirReported.includes(dirPath)) {
      return {};
    }
    // do not expect index files in root and backend test(s) directories
    const ignoredPaths = [new RegExp(`${backendBasePattern}$`),
      new RegExp(`${frontendBasePattern}$`),
      new RegExp(`${backendTestsPattern}`),
    ];
    for (const segment in ignoredResources) {
      if (Object.prototype.hasOwnProperty.call(ignoredResources, segment)) {
        ignoredPaths.push(...ignoredResources[segment].map((e) => new RegExp(pathPatterns[segment][e], 'g')));
      }
    }
    const isIgnored = ignoredPaths.some((e) => e.test(dirPath));
    if (!isIgnored) {
      const filesInDir = fs.readdirSync(dirPath);
      if (filesInDir.includes('index.ts') || filesInDir.includes('index.tsx')) {
        return {};
      }
      dirReported.push(dirPath);
      return {
        Program(node) {
          context.report({
            node,
            messageId: 'suggestion',
            data: {
              dir: dirPath,
            },
          });
        },
      };
    }
    return {};
  },
};
