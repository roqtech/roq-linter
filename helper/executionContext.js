const path = require('path');
const fs = require('fs');

const {
  escapedSep, resourceIdentifiers, allowedNamingPattern,
} = require('../constants');

const getPathPatterns = (backendBasePattern, frontendBasePattern, backendModuleList) => {
  const pathPatterns = { backend: {}, frontend: {} };
  for (const resource of resourceIdentifiers.backend) {
    pathPatterns.backend[resource] = [backendBasePattern, allowedNamingPattern, resource].join(escapedSep);
  }
  for (const resource of backendModuleList) {
    pathPatterns.backend[resource] = [backendBasePattern, resource].join(escapedSep);
  }

  for (const resource of resourceIdentifiers.frontend) {
    pathPatterns.frontend[resource] = [frontendBasePattern, resource].join(escapedSep);
  }

  for (const resource of resourceIdentifiers.frontendCommon) {
    pathPatterns.frontend[resource] = [frontendBasePattern, 'common', resource].join(escapedSep);
  }
  return pathPatterns;
};

const get = (context) => {
  const pluginSettings = context.settings['roq-linter'];
  let backendBasePattern = `.*${escapedSep}backend${escapedSep}src`;
  let frontendBasePattern = `.*${escapedSep}frontend${escapedSep}src`;
  let backendTestsPattern = `.*${escapedSep}backend${escapedSep}tests`;
  let frontendTestsPattern = '';
  const backendModuleList = [];

  if (pluginSettings) {
    const {
      backendBasePath, frontendBasePath, backendTestsBasePath, frontendTestsBasePath,
    } = pluginSettings;
    if (backendBasePath) {
      if (typeof backendBasePath !== 'string' || !path.isAbsolute(`/${backendBasePath}`)) throw new Error('Invalid setting value for backendBasePath. Correct Example : "backend/src" ');
      backendBasePattern = `.*${escapedSep}${backendBasePath.replace(/\//g, escapedSep)}`;
    }
    if (frontendBasePath) {
      if (typeof frontendBasePath !== 'string' || !path.isAbsolute(`/${frontendBasePath}`)) throw new Error('Invalid setting value for frontendBasePath. Correct Example : "frontend/src" ');
      frontendBasePattern = `.*${escapedSep}${frontendBasePath.replace(/\//g, escapedSep)}`;
    }
    if (backendTestsBasePath) {
      if (typeof backendTestsBasePath !== 'string' || !path.isAbsolute(`/${backendTestsBasePath}`)) throw new Error('Invalid setting value for backendTestsBasePath. Correct Example : "backend/tests" ');
      backendTestsPattern = `.*${escapedSep}${backendTestsBasePath.replace(/\//g, escapedSep)}`;
    }
    if (frontendTestsBasePath) {
      if (typeof frontendTestsBasePath !== 'string' || !path.isAbsolute(`/${frontendTestsBasePath}`)) throw new Error('Invalid setting value for frontendTestsBasePath. Correct Example : "frontend/tests" ');
      frontendTestsPattern = `.*${escapedSep}${frontendTestsBasePath.replace(/\//g, escapedSep)}`;
    }
    const backendPath = backendBasePath || 'backend/src';
    try {
      const [ backendPathInitToken ] = backendPath.split('/').filter(e=>e !== '');
      const rootPath = path.resolve('./').replace(backendPathInitToken, '');
      const dirContents = fs.readdirSync(path.resolve(rootPath, backendPath), { withFileTypes: true });
      dirContents.forEach((e) => {
        if (e.isDirectory()) {
          const nestedDirContents = fs.readdirSync(path.resolve(rootPath, backendPath, e.name),
            { withFileTypes: true });
          if (nestedDirContents.some((el) => el.isFile())) {
            backendModuleList.push(e.name);
          } else {
            nestedDirContents.forEach(({ name: moduleName }) => {
              backendModuleList.push([e.name, moduleName].join(escapedSep));
            });
          }
        }
      });
    } catch (_) { /* */ }
    const pathPatterns = getPathPatterns(backendBasePattern, frontendBasePattern, backendModuleList);
    return {
      backendBasePattern,
      frontendBasePattern,
      pathPatterns,
      backendTestsPattern,
      frontendTestsPattern,
      backendModuleList,
    };
  }
  throw new Error('Add a "settings" object in eslint config file. With a nested object named "roq-linter", with allowed keys backendBasePath, frontendBasePath, backendTestsBasePath and frontendTestsBasePath which contain valid paths to the required resources.');
};

module.exports = {
  get,
};
