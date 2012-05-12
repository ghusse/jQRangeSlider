
(function($, undefined){

	function createDemos(){
		var simple = $("<div id='slider' />").appendTo("body"),
			date = $("<div id='date' />").appendTo("body"),
			modifiable = $("<div id='modifiable' />").appendTo("body");

		simple.sliderDemo();
		date.dateSliderDemo();
		modifiable.editSliderDemo();
	}

	$(document).ready(function(){
		createDemos();
	});

})(jQuery);