/* jQRangeSlider
 * A javascript slider selector that supports dates
 * 
 * Copyright (C) Guillaume Gautreau 2010-2011
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
 
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
		ok(!isNaN(this.value), "Value should not be NaN");
		ok(this.value instanceof Date, "Returned values should be dates");
		ok(!isNaN(el.dateRangeSlider("min")), "Returned value should not be NaN");
	}, 
	function(){
		el.dateRangeSlider("destroy");
	}
);
 
testRunner.add("Issues", [issue1]);