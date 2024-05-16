const join = require('path').join;

module.exports = {
  name: "global-keylogger",
  script: join(__dirname, "/src/index.ts"),
  interpreter: process.env.APPDATA + "/npm/node_modules/bun/bin/bun.exe"
};
