var	sprintf = require("sprintf-js").sprintf;

exports.calcPercent = function(correct, attempts) {
	return 100 * (attempts > 0 ? correct / attempts : 0);
}

exports.randomInt = function(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

exports.shuffle = function(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

exports.writeAttempt = function(name, questionId, answer, success) {
	var res = global.demoApp.db.collection('attempts').insert({
		timeStamp: new Date(),
		userName: name,
		questionId: questionId,
		answerNumber: answer,
		success: success});
}

exports.findQuestion = function(questionId) {
	for(var i = 0; i < global.demoApp.questions.length; i++) {
		if(global.demoApp.questions[i]._id.id === questionId) {
			return i;
		}
	}
	console.log("cannot find question ID");
	return null;
}

exports.showQuestions = function(questions) {
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