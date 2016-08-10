// Import all functions from modules
var assignRoles = require('./modules/assignRoles.js');
var chooseParty = require('./modules/chooseParty.js').chooseParty;
var resolveParty = require('./modules/chooseParty.js').resolveParty;
var voteOnParty = require('./modules/voteOnParty.js').voteOnParty;
var resolvePartyVote = require('./modules/voteOnParty.js').resolvePartyVote;
var startQuest = require('./modules/decideQuest.js').startQuest;
var resolveQuest = require('./modules/decideQuest.js').resolveQuest;
var gameEnd = require('.modules/gameOver.js').gameEnd;
var gameOver = require('./modules/gameOver.js').gameOver;
var identifyMerlin = require('./modules/identifyMerlin.js').identifyMerlin;
var resolveIdMerlin = require('./modules/identifyMerlin.js').resolveIdMerlin;

// Export a router to the functions to the game server main file
// Function expects a type [string] to route to the correct function.
// Socket and memcache are objects for the signaling and redis passed from the server
module.exports.gameLogic = function(memcache, socket, type) {
  if (type === 'GAME START') {
    assignRoles(memcache, socket);
  }
};