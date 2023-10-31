const express = require("express");
const appConfig = require("./app");
const dbConfig = require("./config/DB");
const envVariable = require("./config/envVariables");

const app = express();

(async () => {
  try {
    await dbConfig();
    appConfig(app);
    app.listen(envVariable.PORT, () => {
      console.log(`Server listening on ${envVariable.PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
})();
