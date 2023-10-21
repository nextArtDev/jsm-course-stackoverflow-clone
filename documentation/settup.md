## installing Standard eslint

<https://jsmastery.notion.site/Setup-ESLint-Prettier-in-VS-Code-56e50002b82b45b88e36265c5eafbb24>

1. ~pnpm add pnpm add eslint-config-standard
2. adding command in _.eslintrc.json_

  ```json
  {
  "extends": ["next/core-web-vitals" , "standard"]
    }
  ```

3. testing it in terminal
  ~ npm run int
  we should see bunch of errors!

## organizing tailwind eslint

1. ~ npm install eslint-plugin-tailwindcss
2. adding it to _eslint.json_
     ```json

  {
  "extends": ["next/core-web-vitals" , "standard" , "plugin:tailwindcss/recommended"]
    }

  ```

## solving conflict between prettier and eslint

1. ~npm install eslint-config-prettier
2. adding it to _eslint.json_
     ```json

  {
  "extends": ["next/core-web-vitals" , "standard" , "plugin:tailwindcss/recommended" , "prettier"]
    }

  ```

## adding to settings User json (ctrl + shift + p and type it)

  "editor.codeActionsOnSave": {"source.fixAll.eslint":true , "source.addMissingImports":true},
