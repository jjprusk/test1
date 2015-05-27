var express = require('express');
var router = express.Router();
var	sprintf = require("sprintf-js").sprintf;
var demoHelpers = require('../demoHelpers');

/* GET statistics page. */
router
	.get('/', function(req, res, next) {
		global.demoApp.stats.percent = demoHelpers.calcPercent(global.demoApp.stats.nCorrect, global.demoApp.stats.nAttempts);
		res.render('statistics', {sprintf:sprintf, stats: global.demoApp.stats});
	})
	.post('/', function(req, res, next) {
		/*
		 * Delete the attempt records and zero the cached stats.
		 */
		 if(req.body.action == 'reset') {
		 	global.demoApp.db.collection('attempts').remove({},function(err, result) {
				console.log('resetting stats');
				global.demoApp.stats.nAttempts = 0;
				global.demoApp.stats.nCorrect = 0;
				global.demoApp.stats.percent = 0;
				global.console.log(demoApp.stats);
				res.render('statistics', {sprintf:sprintf, stats: demoApp.stats});
			});
		};
	});

module.exports = router;
