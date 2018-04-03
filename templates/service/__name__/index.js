
// TODO work in progress
// Will use minit template mustache to have param to choose joey vs express

const USE_JOEY = process.env.USE_JOEY;
if (USE_JOEY) {
	module.exports = require('./joey');
} else {
	module.exports = require('./express');
}