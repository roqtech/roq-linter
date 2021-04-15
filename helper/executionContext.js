const { escapedSep, resourceIdentifiers, allowedNamingPattern } = require('../constants');

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
  let backendModuleList = resourceIdentifiers.backendModules;

  if (pluginSettings) {
    const {
      backendBasePath, frontendBasePath, backendTestsBasePath, frontendTestsBasePath,
      backendModules,
    } = pluginSettings;
    if (backendBasePath) {
      backendBasePattern = `.*${escapedSep}${backendBasePath.replace(/\//g, escapedSep)}`;
    }
    if (frontendBasePath) {
      frontendBasePattern = `.*${escapedSep}${frontendBasePath.replace(/\//g, escapedSep)}`;
    }
    if (backendTestsBasePath) {
      backendTestsPattern = `.*${escapedSep}${backendTestsBasePath.replace(/\//g, escapedSep)}`;
    }
    if (frontendTestsBasePath) {
      frontendTestsPattern = `.*${escapedSep}${frontendTestsBasePath.replace(/\//g, escapedSep)}`;
    }
    if (backendModules) {
      if (Array.isArray(backendModules) && backendModules.every((e) => typeof e === 'string')) {
        backendModuleList = backendModules.map((e) => e.replace(/\//g, escapedSep));
      } else {
        throw new Error('Invalid setting value for backendModule. Correct Example : ["auth", "nested/event"] ');
      }
    }

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
  throw new Error('Add a "settings" object in eslint config file. With a nested object named "roq-linter", with allowed keys backendBasePath, frontendBasePath, backendTestsBasePath and frontendTestsBasePath which contain valid paths to the required resources. And also a list of "backendModules".');
};

module.exports = {
  get,
};
