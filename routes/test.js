var express = require('express');
var demoHelpers = require('../demoHelpers');
var router = express.Router();
var	sprintf = require("sprintf-js").sprintf;
					

/*
 * GET / POST the test page.
 */
router
	.get('/', function(req, res, next) {
	var order = demoHelpers.shuffle([0,1,2,3]);
	var questionNumber = demoHelpers.randomInt(0, global.demoApp.questions.length-1);
	global.demoApp.stats.percent = demoHelpers.calcPercent(global.demoApp.stats.nCorrect, global.demoApp.stats.nAttempts);
	res.render('test', {title: "Practice questions",
						question: global.demoApp.questions[questionNumber],
						order: demoHelpers.shuffle([0,1,2,3]),
						stats: global.demoApp.stats,
						sprintf: sprintf,
						number: questionNumber});
})
	.post('/', function(req, res, next) {
		global.demoApp.stats.nAttempts++;
		/*
		 * Test for success and render appropriate page. Note that the display order is 
		 * stored as a hidden value on the form.
		 */
		var newOrder = req.body.order.split(",").map(function(x){return parseInt(x)});
		if(parseInt(req.body.answer) === 0) {
			demoHelpers.writeAttempt(
				"Anonymous",
				global.demoApp.questions[req.body.number]._id.id,
				parseInt(req.body.answer),
				true);
			global.demoApp.stats.percent = demoHelpers.calcPercent(++global.demoApp.stats.nCorrect, global.demoApp.stats.nAttempts);
			res.render('test-success', {
				title: "Practice questions",
				question: global.demoApp.questions[parseInt(req.body.number)],
				answer: parseInt(req.body.answer),
				order: newOrder,
				stats: global.demoApp.stats,
				sprintf: sprintf,
				number: parseInt(req.body.number)});
		} else {
			demoHelpers.writeAttempt(
				"Anonymous",
				global.demoApp.questions[req.body.number]._id.id,
				parseInt(req.body.answer),
				false);
			global.demoApp.stats.percent = demoHelpers.calcPercent(global.demoApp.stats.nCorrect, global.demoApp.stats.nAttempts);
			res.render('test-failure', {
				title: "Practice questions",
				question: global.demoApp.questions[parseInt(req.body.number)],
				answer: parseInt(req.body.answer),
				order: newOrder,
				stats: global.demoApp.stats,
				sprintf: sprintf,
				number: parseInt(req.body.number)});
		}
});

module.exports = router;