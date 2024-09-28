import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['eslint.config.mjs', 'node_modules', 'dist'],
    },
    {
        languageOptions: {
            parserOptions: {
                warnOnUnsupportedTypeScriptVersion: false,
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
                project: ['./tsconfig.eslint.json'],
            },
        },
    },
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked
);
