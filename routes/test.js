var express = require('express');
var router = express.Router();
var	sprintf = require("sprintf-js").sprintf;
					

/*
 * GET / POST the test page.
 */
router
	.get('/', function(req, res, next) {
	var order = shuffle([0,1,2,3]);
	var questionNumber = randomInt(0, global.demoApp.questions.length-1);
	res.render('test', {title: "Practice questions",
						question: global.demoApp.questions[questionNumber],
						order: shuffle([0,1,2,3]),
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
			writeAttempt(
				"Anonymous",
				global.demoApp.questions[req.body.number]._id.id,
				parseInt(req.body.answer),
				true);
			global.demoApp.stats.nCorrect++;
			global.demoApp.stats.percent = 100 * (global.demoApp.stats.nAttempts > 0 ?
				global.demoApp.stats.nCorrect / global.demoApp.stats.nAttempts  : 0);
			res.render('test-success', {
				title: "Practice questions",
				question: global.demoApp.questions[parseInt(req.body.number)],
				answer: parseInt(req.body.answer),
				order: newOrder,
				stats: global.demoApp.stats,
				sprintf: sprintf,
				number: parseInt(req.body.number)});
		} else {
			writeAttempt(
				"Anonymous",
				global.demoApp.questions[req.body.number]._id.id,
				parseInt(req.body.answer),
				false);
				global.demoApp.stats.percent = 100 * (global.demoApp.stats.nAttempts > 0 ?
					global.demoApp.stats.nCorrect / global.demoApp.stats.nAttempts  : 0);
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

function show() {
	console.log(global.demoApp.questions.length);
	for(var i=0; i < questions.length; i++) {
			console.log(sprintf("C: %s", global.demoApp.questions[i].Category));
			console.log(sprintf("Q[%i]: %s", i, global.demoApp.questions[i].Question));
			for(var j = 0; j < global.demoApp.questions[i].Answers.length; j++) {
				console.log(sprintf('A[%i]: %s', j, global.demoApp.questions[i].Answers[j]))
			}
			console.log('----------------');
		};
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function writeAttempt(name, questionId, answer, success) {
	var res = global.demoApp.db.collection('attempts').insert({
		timeStamp: new Date(),
		userName: name,
		questionId: questionId,
		answerNumber: answer,
		success: success});
}