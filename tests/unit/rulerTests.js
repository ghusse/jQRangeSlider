

(function(){
	"use strict";
	/*jshint maxstatements: 350*/

	var ruled;

	var scale = {
		first: function(min){
			return Math.floor(min / 10) * 10;
		},
		next: function(previous){
			return previous + 10;
		},
		label: function(value){
			return value;
		}
	};

	var formattedScale = {
		first: function(min){
			return Math.floor(min / 10) * 10;
		},
		next: function(previous){
			return previous + 10;
		},
		format: function(tick, startValue, endValue){
			if (startValue % (2 * 10) && endValue > 0) {
				tick.addClass("formatterTestClass");
			}
		},
		label: function(value){
			return value;
		}
	};

	var el = function(){return $("#test") };

	var ctorTest = new TestCase(
		"Ruler default ctor",
		function(){
			ruled = $("<div />").appendTo(el());
			ruled.ruler();
		},
		function(){
			QUnit.ok(ruled.hasClass("ui-ruler"), "ui-ruler class should have been added");
			ruled.remove();
		}
	);

	var dtorTest = new TestCase(
		"Ruler destructor",
		function(){
			ruled = $("<div />").appendTo(el());
			ruled.ruler({
				min: 0,
				max: 100,
				scales: [scale]
			});

			ruled.ruler("destroy");
		},
		function(){
			QUnit.ok(!ruled.hasClass("ui-ruler"), "ui-ruler class should have been removed");
			QUnit.equal(ruled.find("*").length, 0, "destroy should empty the element");
			ruled.remove();
			ruled = null;
		}
	);

	var ctorWithOneScale = new TestCase(
		"Ctor with one scale",
		function(){
			ruled = $("<div />").appendTo(el());
			ruled.ruler({
				min: 0,
				max: 10,
				scales: [scale]
			});
		},
		function(){
			var scale = ruled.find(".ui-ruler-scale"),
				tick = scale.find(".ui-ruler-tick"),
				label = tick.find(".ui-ruler-tick-label");

			QUnit.equal(scale.length, 1, "Should have created one scale");
			QUnit.equal(tick.length, 1, "Should have created one tick");
			QUnit.equal(label.length, 1, "Should have created one label");
			QUnit.equal(label.text(), "0", "Label text should be correct");
			QUnit.ok(scale.hasClass("ui-ruler-scale0"), "Class should have been initialized for first ruler");
			QUnit.ok(tick.attr("style") && tick.attr("style").indexOf("width: 100%") >= 0, "Width should be 100%: " + tick.attr("style"));

			ruled.ruler("destroy");
			ruled.detach();
		}
	);

	var formattedScaleWith4Ticks = new TestCase(
		"Formatting ticks with one scale of 4 ticks",
		function(){
			ruled = $("<div />").appendTo(el());
			ruled.ruler({
				min: 0,
				max: 40,
				scales: [formattedScale]
			});
		},
		function(){
			var scale = ruled.find(".ui-ruler-scale"),
				tick = scale.find(".ui-ruler-tick"),
				label = tick.find(".ui-ruler-tick-label"),
				formattedTick = scale.find(".formatterTestClass");

			QUnit.equal(scale.length, 1, "Should have created one scale");
			QUnit.equal(tick.length, 4, "Should have created four ticks");
			QUnit.equal(label.length, 4, "Should have created four labels");
			QUnit.equal(formattedTick.length, 2, "Should have created two labels");
			QUnit.ok(scale.hasClass("ui-ruler-scale0"), "Class should have been initialized for first ruler");
			QUnit.ok($(tick[0]).attr("style") && $(tick[0]).attr("style").indexOf("width: 25%") >= 0, "Width should be 25%: " + $(tick[0]).attr("style"));

			ruled.ruler("destroy");
			ruled.detach();
		}
	);

	var scaleStartingAfter = new TestCase(
		"Shifted scale starting after min",
		function(){
			ruled = $("<div />").appendTo(el());

			var shifted = $.extend({}, scale, {
				first: function(){
					return 10;
				}
			});

			ruled.ruler({
				min: 0,
				max: 20,
				scales: [shifted]
			});

		},
		function(){
			var scale = ruled.find(".ui-ruler-scale"),
				tick = scale.find(".ui-ruler-tick"),
				tickStyle = tick.attr("style");

			QUnit.equal(tick.length, 1, "Tick should have been created");
			QUnit.ok(tickStyle.indexOf("width: 50%") >= 0, "Width should be 50% " + tickStyle);
			QUnit.ok(tickStyle.indexOf("margin-left: 50%") >= 0, "Margin-left should be 50% " + tickStyle);

			ruled.ruler("destroy");
			ruled.detach();
		}
	);

	var lasttick = new TestCase(
		"Last tick should have been generated",
		function(){
			ruled = $("<div />").appendTo(el());

			ruled.ruler({
				min: 0,
				max: 25,
				scales: [scale]
			});
		},
		function(){
			var scale = ruled.find(".ui-ruler-scale"),
				tick = scale.find(".ui-ruler-tick"),
				tickStyle = scale.find(".ui-ruler-tick:last").attr("style");

			QUnit.equal(tick.length, 3, "Last tick should have been created");
			QUnit.ok(tickStyle.indexOf("width: 20%") >= 0, "Last tick should be shrinked: " + tickStyle);

			ruled.remove();
		}
	);

	var tickStop = new TestCase(
		"tests test stop",
		function(){
			ruled = $("<div />").appendTo(el());

			var scaleStop = $.extend({}, scale, {
					stop: function(value){
						return value === 30;
					}
				});

			ruled.ruler({
				min: 0,
				max: 100,
				scales: [scaleStop]
			});
		},
		function(){
			var scaleStop = ruled.find(".ui-ruler-scale"),
				ticks = scaleStop.find(".ui-ruler-tick");

			QUnit.equal(ticks.length, 3, "Should have stopped on false");

			ruled.remove();
		});

	var setMinOption = new TestCase(
		"Set min option after construction",
		function(){
			ruled = $("<div />").appendTo(el());
			ruled.ruler({
				min: 0,
				max: 100,
				scales: [scale]
			});

			ruled.ruler("option", "min", 50);
		},
		function(){
			var scale = ruled.find(".ui-ruler-scale"),
				ticks = scale.find(".ui-ruler-tick");
			
			QUnit.equal(ticks.length, 5, "Ruler should have been regenerated");

			ruled.remove();
		});

	var setMaxOption = new TestCase(
		"Set max option after construction",
		function(){
			ruled = $("<div />").appendTo(el());
			ruled.ruler({
				min: 0,
				max: 100,
				scales: [scale]
			});

			ruled.ruler("option", "max", 60);
		},
		function(){
			var scale = ruled.find(".ui-ruler-scale"),
				ticks = scale.find(".ui-ruler-tick");
			
			QUnit.equal(ticks.length, 6, "Ruler should have been regenerated");

			ruled.remove();
		});

	var setScalesOption = new TestCase(
		"Set scales options after construction",
		function(){
			ruled = $("<div />").appendTo(el());
			ruled.ruler({
				min: 0,
				max: 100,
				scales: [scale]
			});

			ruled.ruler("option", "scales", [scale, scale]);
		},
		function(){
			var scales = ruled.find(".ui-ruler-scale");

			QUnit.equal(scales.length, 2, "Ruler should have been regenerated");
			ruled.remove();
		});

	var dateRuler = new TestCase(
		"Ruler with dates",
		function(){
			var scale = {
				next: function(previous){
					var next = new Date(previous);
					return new Date(next.setDate(previous.getDate() + 2));
				},
				label: function(val){
					return val.toString();
				}
			}
			ruled = $("<div />").appendTo(el());
			ruled.ruler({
				min: new Date(2012, 0, 1),
				max: new Date(2012, 0, 6),
				scales: [scale]
			}); 
		},
		function(){
			var ticks = ruled.find(".ui-ruler-tick"),
				lasttick = ruled.find(".ui-ruler-tick:last"),
				style = ticks.attr("style"),
				lastStyle = lasttick.attr("style");

			QUnit.equal(ticks.length, 3, "ticks should have been created, even with dates");
			QUnit.ok(style.indexOf("width: 40%") >= 0, "ticks should have been correctly dimensionned: " + style);
			QUnit.ok(lastStyle.indexOf("width: 20%") >= 0, "Last tick should have been correctly shrinked: " + lastStyle);

			ruled.remove();
		});

	testRunner.add("ruler", [ctorTest, dtorTest,
		ctorWithOneScale,
		formattedScaleWith4Ticks,
		scaleStartingAfter,
		lasttick,
		tickStop,
		setMinOption, setMaxOption, setScalesOption,
		dateRuler]);
}());
