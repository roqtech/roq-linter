const path = require('path');
const fs = require('fs');

const {
  escapedSep, resourceIdentifiers, allowedNamingPattern, moduleIdentifyingDirs,
} = require('../constants');

const getPathPatterns = (backendBasePattern, frontendBasePattern) => {
  const pathPatterns = { backend: {}, frontend: { moduleDir: { common: {} } } };
  for (const resource of resourceIdentifiers.backend) {
    pathPatterns.backend[resource] = [backendBasePattern, `${allowedNamingPattern}[${escapedSep}a-zA-Z0-9_-]+`, resource].join(escapedSep);
  }

  for (const resource of resourceIdentifiers.frontend) {
    pathPatterns.frontend[resource] = [frontendBasePattern, resource].join(escapedSep);
  }

  for (const resource of resourceIdentifiers.frontendCommon) {
    pathPatterns.frontend.moduleDir.common[resource] = [frontendBasePattern, 'modules', 'common', resource].join(escapedSep);
  }

  for (const resource of resourceIdentifiers.frontendModule) {
    if (resource === 'components') {
      pathPatterns.frontend.moduleDir[resource] = [frontendBasePattern, 'modules', allowedNamingPattern, resource, allowedNamingPattern].join(escapedSep);
    } else {
      pathPatterns.frontend.moduleDir[resource] = [frontendBasePattern, 'modules', allowedNamingPattern, resource].join(escapedSep);
    }
  }

  return pathPatterns;
};

const get = (context) => {
  const pluginSettings = context.settings['roq-linter'];
  let backendBasePattern = `.*${escapedSep}backend${escapedSep}src`;
  let frontendBasePattern = `.*${escapedSep}frontend${escapedSep}src`;
  let backendTestsPattern = `.*${escapedSep}backend${escapedSep}tests`;
  let frontendTestsPattern = '';

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

    const pathPatterns = getPathPatterns(backendBasePattern, frontendBasePattern);
    return {
      backendBasePattern,
      frontendBasePattern,
      pathPatterns,
      backendTestsPattern,
      frontendTestsPattern,
    };
  }
  throw new Error('Add a "settings" object in eslint config file. With a nested object named "roq-linter", with allowed keys backendBasePath, frontendBasePath, backendTestsBasePath and frontendTestsBasePath which contain valid paths to the required resources.');
};

const isBackendModule = (dirPath) => {
  const filesInDir = fs.readdirSync(dirPath);
  return filesInDir.some((e) => moduleIdentifyingDirs.includes(e));
};

module.exports = {
  get,
  isBackendModule,
};
