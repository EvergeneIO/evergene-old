/***********************************************************************************************************************************************\
*   Name: EVERGENE - Stats                                                                                                                      *
*   Author: CuzImStantac                                                                                                                        *
*   Description: This is the offical EVERGENE - Stats bot                                                                                       *
*   Version: 2.1.1                                                                                                                              *
\***********************************************************************************************************************************************/

const Bot = require("./classes/Bot.js");
const router = require("express").Router();
require("dotenv").config();

module.exports = router;

 new Embed('817546914781593650', 'Bot', Embed.STARTING, {
      webID: process.env.WEBHOOK_ID,
      webTOKEN: process.env.WEBHOOK_TOKEN
  }, `${Bot.cwd}/actions/temp.txt`, Date.now(), process.env.APP_MODE);

Bot.boot();
