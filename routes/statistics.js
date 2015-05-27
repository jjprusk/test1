var express = require('express');
var router = express.Router();
var	sprintf = require("sprintf-js").sprintf;

/* GET statistics page. */
router
	.get('/', function(req, res, next) {
		calcPercent();
		res.render('statistics', {sprintf:sprintf, stats: global.demoApp.stats});
	})
	.post('/', function(req, res, next) {
		/*
		 * Delete the attempt records and zero the cached stats.
		 */
		 if(req.body.action == 'reset') {
		 	global.demoApp.db.collection('attempts').remove({},function(err, result) {
				console.log('resetting stats');
				calcPercent();
				global.demoApp.stats.nAttempts = 0;
				global.demoApp.stats.nCorrect = 0;
				global.demoApp.stats.percent = 0;
				global.console.log(demoApp.stats);
				res.render('statistics', {sprintf:sprintf, stats: demoApp.stats});
			});
		};
	});
	
function calcPercent() {
	global.demoApp.stats.percent = 100 * (global.demoApp.stats.nAttempts > 0 ?
		global.demoApp.stats.nCorrect / global.demoApp.stats.nAttempts  : 0);
}

module.exports = router;
