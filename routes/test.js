var express = require('express');
var router = express.Router();
var	sprintf = require("sprintf-js").sprintf;

/*
 * GET / POST the test page.
 */
router
	.get('/', function(req, res, next) {
	var order = shuffle([0,1,2,3]);
	var questionNumber = randomInt(0,questions.length-1);
	res.render('test', {title: "Practice questions",
						question: questions[questionNumber],
						order: shuffle([0,1,2,3]),
						number: questionNumber});
})
	.post('/', function(req, res, next) {
		/*
		 * Test for success and render appropriate page. Note that the display order is 
		 * stored as a hidden value on the form.
		 */
		var newOrder = req.body.order.split(",").map(function(x){return parseInt(x)});
		if(parseInt(req.body.answer) === 0) {
			writeAttempt(
				"Anonymous",
				questions[req.body.number]._id.id,
				parseInt(req.body.answer),
				true);
			res.render('test-success', {
				title: "Practice questions",
				question: questions[parseInt(req.body.number)],
				answer: parseInt(req.body.answer),
				order: newOrder,
				number: parseInt(req.body.number)});
		} else {
			writeAttempt(
				"Anonymous",
				questions[req.body.number]._id.id,
				parseInt(req.body.answer),
				false);
			res.render('test-failure', {
				title: "Practice questions",
				question: questions[parseInt(req.body.number)],
				answer: parseInt(req.body.answer),
				order: newOrder,
				number: parseInt(req.body.number)});
		}
});

module.exports = router;

function show() {
	console.log(questions.length);
	for(var i=0; i < questions.length; i++) {
			console.log(sprintf("C: %s", questions[i].Category));
			console.log(sprintf("Q[%i]: %s", i, questions[i].Question));
			for(var j = 0; j < questions[i].Answers.length; j++) {
				console.log(sprintf('A[%i]: %s', j, questions[i].Answers[j]))
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
	var res = db.collection('attempts').insert({
		timeStamp: new Date(),
		userName: name,
		questionId: questionId,
		answerNumber: answer,
		success: success});
	console.log("result = " + res); 
}