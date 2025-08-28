module.exports = {
  env: {
    node: true,
    es2020: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "commonjs",
  },
  rules: {
    "no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^[A-Z_]",
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "no-undef": "off", // Node.js tiene require, module, process, etc.
    "no-console": "off", // Permitir console.log en el backend
  },
  globals: {
    require: "readonly",
    module: "readonly",
    exports: "readonly",
    __dirname: "readonly",
    __filename: "readonly",
    process: "readonly",
    global: "readonly",
    Buffer: "readonly",
    setTimeout: "readonly",
    clearTimeout: "readonly",
    setInterval: "readonly",
    clearInterval: "readonly",
  },
};
