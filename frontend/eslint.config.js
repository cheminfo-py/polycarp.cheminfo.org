import { defineConfig, globalIgnores } from 'eslint/config';
import cheminfoReact from 'eslint-config-cheminfo-react';
import cheminfoTs from 'eslint-config-cheminfo-typescript';

export default defineConfig(
  globalIgnores(['dist', 'coverage']),
  ...cheminfoTs,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    extends: cheminfoReact,
  },
);
