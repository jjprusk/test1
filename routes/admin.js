var express = require('express');
var router = express.Router();
var assert = require('assert');
var moment = require('moment');

/* GET admin page. */

router.get('/', function(req, res, next) {
	/*
	 * Get the attempts records from the database and display them.
	 */
	db.collection('attempts').find({}).sort({timeStamp:-1}).limit(20).toArray(function(err, items) {
		assert.equal(null, err);
		var attemptQuestions = new Array();
		for(var i = 0; i < items.length; i++) {
			var questionIndex = findQuestion(items[i].questionId);
			attemptQuestions.push({
				question: questions[questionIndex].Question,
				answer: questions[questionIndex].Answers[items[i].answerNumber],
				success: items[i].success});
		}
		res.render('admin', {title: 'Admin', attempts: items, questions: attemptQuestions, moment: moment});
	});
});

module.exports = router;

/*
 * Return the index into the question array based on the object ID.
 */
function findQuestion(questionId) {
	for(var i = 0; i < questions.length; i++) {
		if(questions[i]._id.id === questionId) {
			return i;
		}
	}
	console.log("cannot find question ID");
	return null;
}