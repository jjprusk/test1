$( document ).ready(function() {
	/*
	 * Get the statistics and update the div.
	 */
	$("span.reset-link").click(function(){
		$.ajax({url: "statistics", 
				type: 'POST',
				data: {action: "reset"},
				success: function(result) {
			$("div#statistics").replaceWith(result);
			if($('table#admin-attempts').length) location.reload(true);
    		}
    	});
	});
	/*
	 * Make sure user has made a selection
	 */
	$('form#selectAnswer').submit(function() {
		return $("input:radio[name='answer']").is(':checked');
	});
});

