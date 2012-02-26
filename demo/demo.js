
(function($, undefined){

	function createDemos(){
		var simple = $("<div id='slider' />").appendTo("body"),
			date = $("<div id='date' />").appendTo("body");
		simple.sliderDemo();
		date.dateSliderDemo();
	}

	$(document).ready(function(){
		createDemos();
	});

})(jQuery);