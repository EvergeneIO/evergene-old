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

Bot.boot();
