$( document ).ready(function() {
	//alert("ready");
	
	$("span.reset-link").click(function(){
		console.log("issuing ajax");
		$.ajax({url: "statistics", 
				type: 'POST',
				data: {action: "reset"},
				success: function(result) {
			$("div#statistics").replaceWith(result);
			if($('table#admin-attempts').length) location.reload(true);
    		console.log(result);
    		}
    	});
	});
});
//
//        type: 'POST',
//        data: { field1: "hello", field2 : "hello2"} ,
//        contentType: 'application/json; charset=utf-8',
