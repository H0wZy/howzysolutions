import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import nextVitals from 'eslint-config-next/core-web-vitals'
import { defineConfig, globalIgnores } from 'eslint/config'

// A colour literal in a component is a defect (constitution VI): colours live in
// src/styles/tokens.css and reach components through Tailwind or shadcn variables.
// esquery strips backslashes, so the regex uses character classes only.
const COLOUR = '^[ ]*(#[0-9a-fA-F]{3,8}|(rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|hwb|color)[(])'
const colourRule = (selector) => ({ selector, message: 'No literal colour in a component: use a token (constitution VI).' })

export default defineConfig([
  globalIgnores(['node_modules', 'dist', '.vinext', '.wrangler', '.next', 'public', 'next-env.d.ts']),
  ...nextVitals,
  {
    files: ['scripts/**/*.{mjs,js}', '*.mjs'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node, ecmaVersion: 'latest', sourceType: 'module' },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      // A non-null assertion needs an eslint-disable line that says why the value cannot be absent.
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
  {
    files: ['src/app/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        colourRule(`Literal[value=/${COLOUR}/]`),
        colourRule(`TemplateElement[value.raw=/${COLOUR}/]`),
      ],
    },
  },
])
