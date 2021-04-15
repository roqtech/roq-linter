# Warning on incorrect views placing or naming (view-correct-location-and-name)

All views should be placed in correct location. Exported function component name should match the view file mame.

## Rule Details

This rule will throw warning if view file is places not in this location (frontend/src/views/{view-name}/{view-name}.view.tsx).
Also it will throw warning if exported function component name mismatches the view file mame.

Examples of **incorrect** code for this rule:

```js
// file like test.view.tsx not located in "views" folder -> Warning!

// file name = users.view.tsx; exported component name = Users -> Warning!
```

Examples of **correct** code for this rule:

```js
// file like test.view.tsx located in "views" folder

// file name = users.view.tsx; exported component name = UsersView
```
