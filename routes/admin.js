var express = require('express');
var router = express.Router();
var assert = require('assert');
var moment = require('moment');
var	sprintf = require("sprintf-js").sprintf;
var demoHelpers = require('../demoHelpers');

/* GET admin page. */

router.get('/', function(req, res, next) {
	/*
	 * Get the attempts records from the database and display them.
	 */
	global.demoApp.db.collection('attempts').find({}).sort({timeStamp:-1}).limit(20).toArray(function(err, items) {
		if(err != null) {
			console.log('Error getting attempt records: ' + err);
		}
		var attemptQuestions = new Array();
		for(var i = 0; i < items.length; i++) {
			var questionIndex = demoHelpers.findQuestion(items[i].questionId);
			attemptQuestions.push({
				question: global.demoApp.questions[questionIndex].Question,
				answer: global.demoApp.questions[questionIndex].Answers[items[i].answerNumber],
				success: items[i].success});
		}
		global.demoApp.stats.percent = demoHelpers.calcPercent(global.demoApp.stats.nCorrect, global.demoApp.stats.nAttempts);	
		res.render('admin', {title: 'Admin',
					sprintf : sprintf,
					attempts: items,
					stats: global.demoApp.stats,
					questions: attemptQuestions,
					moment: moment,
					systemStart: global.demoApp.systemStart
		});
	});
});

module.exports = router;
