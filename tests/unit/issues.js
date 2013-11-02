/* jQRangeSlider
 * A javascript slider selector that supports dates
 * 
 * Copyright (C) Guillaume Gautreau 2010-2011
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

(function(){
	"use strict";

	function init(){
		el = $("#test");
	}

	var issue1 = new TestCase(
		"Issue 1: bounds setting",
		function(){
			this.format = function(value){
				this.value = value;
			};
			
			this.bounds = {min:new Date(2010,0,1), max:new Date(2011, 0, 1)};
			el.dateRangeSlider({bounds:this.bounds, formatter:$.proxy(this.format, this)});
			this.sim = function(){
				el.find(".ui-rangeSlider-leftHandle").simulate("drag", {dx:-20,dy:0});
			}
			
			setTimeout(this.sim, 100);
			this.delay=500;
		},
		function(){
			QUnit.ok(!isNaN(this.value), "Value should not be NaN");
			QUnit.ok(this.value instanceof Date, "Returned values should be dates");
			QUnit.ok(!isNaN(el.dateRangeSlider("min")), "Returned value should not be NaN");
		}, 
		function(){
			el.dateRangeSlider("destroy");
		}
	);

	var issue90 = new TestCase(
		"Issue 90: range and bounds",
		function(){
			init();
			this.bounds = {
				min: new Date(2016, 0, 1),
				max: new Date(2017, 0, 1)
			};

			el.dateRangeSlider({
				bounds: this.bounds,
				range: {min: {months: 1}}
			});
		},
		function(){
			var values = el.dateRangeSlider("values");
			QUnit.ok(values.min >= this.bounds.min && values.min <= this.bounds.max, "Min value should be between bounds " + values.min);
			QUnit.ok(values.max >= this.bounds.min && values.max <= this.bounds.max, "Max value should be between bounds " + values.max);
		},
		function(){
			el.dateRangeSlider("destroy");
		}
	);

	var issue102 = new TestCase(
		"Issue 102: valuesChanged fired even if values did not change (dateSlider)",
		function(){
			init();
			this.bounds = {
				min: new Date(2016, 0, 1),
				max: new Date(2017, 0, 1)
			};

			this.values = {
				min: new Date(2016, 1, 1),
				max: new Date(2016, 2, 1)
			};

			el.dateRangeSlider({
				bounds: this.bounds,
				defaultValues: this.values
			});

			this.triggered = false;
		},
		function(){
			var that = this;
			el.bind("valuesChanged", function(){
				that.triggered = true;
			});

			el.dateRangeSlider("values", new Date(this.values.min.valueOf()), new Date(this.values.max.valueOf()));

			QUnit.ok(!this.triggered, "Values did not change, event should not have been fired");
		},
		function(){
			el.dateRangeSlider("destroy");
		}
	);

	var issue100 = new TestCase(
		"Issue 100: scales parameter should be consistent",
		function(){
			init();

			el.dateRangeSlider({
				scales: [
					{
						next: function(previous){
							QUnit.ok(previous instanceof Date, "Previous value should be a date: " + previous);

							var next = new Date(previous);

							return new Date(next.setMonth(new Date(previous).getMonth() + 1));
						}
					}
				]
			});
		},
		function(){
			el.dateRangeSlider("bounds", new Date(2012, 0, 1), new Date(2012, 11, 31, 12, 59, 59));
		},
		function(){
			setTimeout(function(){
				el.dateRangeSlider("destroy");
			}, 1);
		}
	);
	 
	testRunner.add("Issues", 
			[	
				issue1, 
				issue90,
				issue100,
				issue102
			]
	);
}());