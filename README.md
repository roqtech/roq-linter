# roq-linter
​
The purpose of roq-linter is to ensure that code adheres to the coding convention rulebook; the goal is to perform automated checks. Clearly, we are not attempting to validate logical workflows that require human interaction or technical expertise. However, anything that can be caught prior to a PR review should be caught to minimize reviewer effort and control swaps between the PR owner/opener/raiser and the reviewer.
​
### How to configure this plugin to work with your roq project?
We expose three distinct configurations, one for each resource type (backend/frontend and a general one):
​
- Common Configuration (Contains general conventions that are useful for the entire project)
- Backend Configuration (Contains backend-related conventions that are useful for the directory in which the backend code is located).
- Frontend Configuration (Contains frontend-related conventions that are useful for the directory in which the frontend code is located).
​

**Step 1**: Add the roq-linter plugin as a dependency to your project:
​
> npm install -D @roq/eslint-plugin
​

**Step 2**: Add required configurations to eslint configuration file(.eslintrc):
​
1. Configure the plugin:
  >   plugins: ['@roq'],

2. Extend the desired config (as per project needs):
  > extends: ['plugin:@roq/backendConfig','plugin:@roq/commonConfig'],
​

3. Add the settings for this plugin:
​
The settings anticipates the following information (the path separator to use when defining these values should be a nix-styled '/') in the settings object under the 'roq-linter' key:

> - backendBasePath (default:'backend/src') => 'The base relative path (from project's root) of backend related code'
​
> - frontendBasePath (default:'frontend/src') => 'The base relative path (from project's root) of frontend related code'
​
> - backendTestsBasePath (default:'backend/tests') => 'The relative path (from project's root) of backend related tests'
​
A sample settings object looks like =>
```json
"settings": {
    "roq-linter":{
      "backendBasePath": "backend/src",
      "frontendBasePath": "frontend/src",
      "backendTestsBasePath": "backend/tests"
    }
  }
```
​
**Step 3**: Some rules of this plugin need to be manually configured in your eslint configuration file(.eslintrc):
​
> ### no-invalid-dirname
>
> The configuration defines the naming criteria for your directory names, including the characters to use, the case to use, and whether or not to allow numbers. By default, lowercase alphanumeric strings with dots and hyphens are used.
​

> ### no-use-deprecated-modules
>
> The configuration specifies which node modules should not be used by your project. This rule is useful in situations where modules are popular among developers but have been deprecated.
​


> ### no-use-global-module
>
> The configuration declares which nestjs modules are global and thus also aims to prevent other modules to import them.
​

To know all the roq-conventions, have a look at our entire documentation [here](https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/lwfc-roq-integrated-rulebook).

