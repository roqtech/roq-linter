const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-invalid-partial-and-component-resource');

const ruleTesterInstance = new RuleTester({
  parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
  parser: require.resolve('@typescript-eslint/parser'),
  settings: {
    'roq-linter': {
      backendBasePath: 'backend/src',
      frontendBasePath: 'frontend/src',
      backendTestsBasePath: 'backend/tests',
    },
  },
});

ruleTesterInstance.run('no-invalid-partial-and-component-resource', ruleUnderTest, {
  valid: [
    {
      code: 'export const Comp1 = (): ReactElement =>{/* definition */}',
      filename: 'frontend/src/modules/auth/components/comp1/comp1.component.ts',
    },
    {
      code: `export interface NotificationClasses {}
      export const useNotificationStyles = ()=>{/* definition */}`,
      filename: 'frontend/src/modules/common/components/notification/notification.styles.ts',
    },
    {
      code: `import { ReactElement as RE } from 'react';
      export interface DialogProps {}
      export const Dialog = (props: DialogProps): RE =>{/* definition */}`,
      filename: 'frontend/src/views/settings/partials/dialog/dialog.partial.tsx',
    },
    {
      code: `import react from 'react';
      export interface DialogProps {};
      export const Dialog = (props: DialogProps): react.ReactElement =>{/* definition */}`,
      filename: 'frontend/src/views/settings/partials/dialog/dialog.partial.tsx',
    },
    {
      code: `import * as r from 'react';
      export interface DialogProps {};
      export const Dialog = (props: DialogProps): r.ReactElement =>{/* definition */}`,
      filename: 'frontend/src/views/settings/partials/dialog/dialog.partial.tsx',
    },
    {
      code: `import { FunctionComponent } from 'react';
      export interface DialogProps {};
      export const Dialog: FunctionComponent = () =>{/* definition */}`,
      filename: 'frontend/src/views/settings/partials/dialog/dialog.partial.tsx',
    },
    {
      code: `import react from 'react';
      export interface DialogProps {};
      export const Dialog: react.FunctionComponent = () =>{/* definition */}`,
      filename: 'frontend/src/views/settings/partials/dialog/dialog.partial.tsx',
    },
    {
      code: `import * as rt from 'react';
      export interface DialogProps {};
      export const Dialog: rt.FunctionComponent = () =>{/* definition */}`,
      filename: 'frontend/src/views/settings/partials/dialog/dialog.partial.tsx',
    },
    {
      code: `import { FC as funcComp } from 'react';
      export interface DialogProps {};
      export const Dialog: funcComp = () =>{/* definition */}`,
      filename: 'frontend/src/views/settings/partials/dialog/dialog.partial.tsx',
    },
    {
      code: `import react from 'react';
      export interface DialogProps {};
      export const Dialog: react.FC = () =>{/* definition */}`,
      filename: 'frontend/src/views/settings/partials/dialog/dialog.partial.tsx',
    },
    {
      code: `import * as rt from 'react';
      export interface DialogProps {};
      export const Dialog: rt.FC = () =>{/* definition */}`,
      filename: 'frontend/src/views/settings/partials/dialog/dialog.partial.tsx',
    },
    {
      code: `import { memo as mem } from 'react';
      export interface DialogProps {};
      export const Dialog = mem((props: DialogProps)  => {/* definition */});
      `,
      filename: 'frontend/src/views/settings/partials/dialog/dialog.partial.tsx',
    },
    {
      code: `import react from 'react';
      export interface DialogProps {};
      export const Dialog = react.memo((props: DialogProps)  => {/* definition */});
      `,
      filename: 'frontend/src/views/settings/partials/dialog/dialog.partial.tsx',
    },
    {
      code: `import * as rct from 'react';
      export interface DialogProps {};
      export const Dialog = rct.memo((props: DialogProps)  => {/* definition */});
      `,
      filename: 'frontend/src/views/settings/partials/dialog/dialog.partial.tsx',
    },
    {
      code: `import { forwardRef as forRef } from 'react';
      export interface DialogProps {};
      export const Dialog = forRef<HTMLInputElement, DialogProps>((props, ref) => {/* definition */});
      `,
      filename: 'frontend/src/views/settings/partials/dialog/dialog.partial.tsx',
    },
    {
      code: `import react from 'react';
      export interface DialogProps {};
      export const Dialog = react.forwardRef<HTMLInputElement, DialogProps>((props, ref) => {/* definition */});
      `,
      filename: 'frontend/src/views/settings/partials/dialog/dialog.partial.tsx',
    },
    {
      code: `import * as r from 'react';
      export interface DialogProps {};
      export const Dialog = r.forwardRef<HTMLInputElement, DialogProps>((props, ref) => {/* definition */});
      `,
      filename: 'frontend/src/views/settings/partials/dialog/dialog.partial.tsx',
    },
    {
      code: `import * as r from 'react';
      import Paper, { PaperProps } from '@mui/material/Paper';
      export const Dialog = r.forwardRef<HTMLInputElement, PaperProps>((props, ref) => {/* definition */});
      `,
      filename: 'frontend/src/views/settings/partials/dialog/dialog.partial.tsx',
    },
  ],
  invalid: [
    {
      code: `export const Comp1= (props: CustomPropTypes): ReactElement =>{/* definition */}
      export const Comp2 = (props: CustomPropTypes): ReactElement =>{/* definition */}`,
      errors: [
        {
          messageId: 'missingOrExtraNamedExport',
        },
      ],
      filename: 'frontend/src/modules/common/components/dialog/dialog.component.ts',
    },
    {
      code: `export class Comp1 {/* definition */}
      export interface Comp2Props {}
      export const Comp2 = (props: Comp2Props): ReactElement =>{/* definition */}`,
      errors: [
        {
          messageId: 'disallowedClassExport',
        },
      ],
      filename: 'frontend/src/modules/common/components/dialog/dialog.component.ts',
    },
    {
      code: '// File Path : frontend/src/modules/common/components/notification/notifications.component.ts With No code',
      errors: [
        {
          messageId: 'missingOrExtraNamedExport',
        },
        {
          messageId: 'invalidFileName',
          data: {
            expectedFileName: 'notification.component.tsx',
          },
        },
      ],
      filename: 'frontend/src/modules/common/components/notification/notifications.component.ts',
    },
    {
      code: `import { ReactElement } from 'react';
      export interface DialogPropsInterface {}
      export interface DialogAdditionalInterface {}
      export const Dialog = (props: DialogPropsInterface): ReactElement =>{/* definition */}`,
      errors: [
        {
          messageId: 'invalidPropsInterfaceSuffix',
        },
      ],
      filename: 'frontend/src/modules/common/components/dialog/dialog.component.ts',
    },
    {
      code: `import { ReactElement } from 'react';
      export type DialogProps = {dummy?:string}
      export const Dialog = (props: DialogProps): ReactElement =>{/* definition */}`,
      errors: [
        {
          messageId: 'disallowedTypePropsTypeDef',
        },
      ],
      filename: 'frontend/src/modules/common/components/dialog/dialog.component.ts',
    },
    {
      code: `import { forwardRef } from 'react';
      export const Dialog = forwardRef<HTMLInputElement, DialogProps>((props, ref) => {/* definition */});
      `,
      errors: [
        {
          messageId: 'missingPropsTypeDefInFile',
        },
      ],
      filename: 'frontend/src/modules/common/components/dialog/dialog.component.ts',
    },
  ],
});
