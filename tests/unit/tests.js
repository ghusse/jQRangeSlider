/* jQRangeSlider
 * A javascript slider selector that supports dates
 * 
 * Copyright (C) Guillaume Gautreau 2010
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

/**
 * jQRangeSlider
 */

var el = null;

(function(){
	"use strict";
	/*jshint maxstatements: 100*/
	var setUp = new TestCase(
		"Setup",
		function(){
			el = $("#test");
		},
		null
	);

	function initEl(){
		el = $("#test");
	}

	var defaultCtorTest = new TestCase(
		"Default ctor",
		function(){
			el = $("#test")
			el.rangeSlider();
		},
		function() {
			// Default values tests
			QUnit.deepEqualEpsilon(el.rangeSlider("option", "bounds"), { min:0, max:100 }, 1e-3, "Default bounds should be 0-100");
			QUnit.deepEqualEpsilon(el.rangeSlider("option", "bounds"), { min:0, max:100 }, 1e-3, "Default bounds should be 0-100");
			QUnit.deepEqualEpsilon(el.rangeSlider("option", "defaultValues"), {min:20, max:50}, 1e-3, "Default values should be 20-50");
			QUnit.deepEqual(el.rangeSlider("option", "wheelMode"), null, "Default wheel mode should be empty");
			QUnit.deepEqual(el.rangeSlider("option", "wheelSpeed"), 4, "Default wheel mode should be empty");
			QUnit.ok(el.rangeSlider("option", "arrows"), "Arrows should be activated by default");
			QUnit.deepEqual(el.rangeSlider("option", "valueLabels"), "show", "Value labels should be activated on value 'show' by default");
			QUnit.deepEqual(el.rangeSlider("option", "formatter"), null, "Default formatter should be used (null value)");
			QUnit.deepEqual(el.rangeSlider("option", "durationIn"), 0, "Default duration for showing labels is 0ms");
			QUnit.deepEqual(el.rangeSlider("option", "durationOut"), 400, "Default duration for hiding labels is 400ms");
			QUnit.deepEqual(el.rangeSlider("option", "delayOut"), 200, "Default delay before hiding labels is 200ms");
			QUnit.deepEqual(el.rangeSlider("option", "range"), {min:false, max:false}, "Default constraints on range");
			QUnit.equal(el.rangeSlider("option", "scales"), false, "Default option for scales");
			QUnit.equal(el.rangeSlider("option", "enabled"), true, "Default option value for enabled status");
			
			// Created elements
			QUnit.deepEqual($(".ui-rangeSlider-handle.ui-rangeSlider-leftHandle").length, 1, "Left handle should have been created");
			QUnit.deepEqual($(".ui-rangeSlider-handle.ui-rangeSlider-rightHandle").length, 1, "Right handle should have been created");
			QUnit.deepEqual($(".ui-rangeSlider-label.ui-rangeSlider-leftLabel").length, 1, "Left label should have been created");
			QUnit.deepEqual($(".ui-rangeSlider-label.ui-rangeSlider-rightLabel").length, 1, "Right label should have been created");
			
			// Arrows
			QUnit.deepEqual($(".ui-rangeSlider-arrow.ui-rangeSlider-leftArrow").length, 1, "Left arrow should have been created");
			QUnit.deepEqual($(".ui-rangeSlider-arrow.ui-rangeSlider-rightArrow").length, 1, "Right arrow should have been created");
			QUnit.deepEqual($(".ui-rangeSlider-arrow.ui-rangeSlider-leftArrow").css("display"), "block", "Left arrow should have been created");
			QUnit.deepEqual($(".ui-rangeSlider-arrow.ui-rangeSlider-rightArrow").css("display"), "block", "Arrows should be visible");
			QUnit.ok(el.hasClass("ui-rangeSlider-withArrows"), "ui-rangeSlider-withArrows should be applied to the parent element");
			
			// Bars
			QUnit.deepEqual($(".ui-rangeSlider-innerBar").length, 1, "The inner bar should have been created");
			QUnit.deepEqual($(".ui-rangeSlider-bar").length, 1, "The bar should have been created");
			
			QUnit.deepEqual($(".ui-rangeSlider-container").outerWidth(true), el.innerWidth(), "Container");
			
			// Values
			QUnit.equalEpsilon(this.min(), 20, 1e-3, "Values should be equal to the default values");
			QUnit.equalEpsilon(this.max(), 50, 1e-3, "Values should be equal to the default values");
		}
	);

	var defaultSetup = new TestCase(
		"Default setup without assertions",
		function(){
			el.rangeSlider("destroy");
			el.rangeSlider();
		},
		null
	);

var destroyTest = new TestCase(
	"Destroy",
	function(){
		el.rangeSlider("destroy");
	},
	function(){	
		QUnit.deepEqual(el.children().length, 0, "Parent element should be empty");
		QUnit.deepEqual(el.attr("class"), "", "Class attribute on parent element should be empty");
	}
);

var destroy = new TestCase(
	"Destroy",
	function(){
		el.rangeSlider("destroy");
	},
	null
);

var customCtorTest = new TestCase(
	"Custom ctor",
	function(){
		el.rangeSlider("destroy");
		this.defaultValues = {min:150, max:500};
		this.bounds = {min:-10, max:1000};
		
		el.rangeSlider(
			{
				defaultValues : this.defaultValues,
				bounds: this.bounds
			}
		);
	},
	function(){
		var bounds = el.rangeSlider("option", "bounds");
		var defaultValues = el.rangeSlider("option", "defaultValues");
		var values = el.rangeSlider("values");
		
		QUnit.deepEqual(bounds.min, this.bounds.min, "Bounds min value should have been correctly set");
		QUnit.deepEqual(bounds.max, this.bounds.max, "Bounds max value should have been correctly set");
		QUnit.deepEqual(defaultValues.min, this.defaultValues.min, "Default min value should have been correctly set");
		QUnit.deepEqual(defaultValues.max, this.defaultValues.max, "Default max value should have been correctly set");
		QUnit.deepEqual(values.min, this.defaultValues.min, "Min value should have been correctly set");
		QUnit.deepEqual(values.max, this.defaultValues.max, "Max value should have been correctly set");
	}
);

var hideLabelsTest = new TestCase(
	"Hide labels",
	function(){
		el.rangeSlider("option", "valueLabels", "hide");
	},
	function(){
		QUnit.deepEqual($(".ui-rangeSlider-label").length, 0, "Value labels should have been detached");
		QUnit.deepEqual(el.rangeSlider("option", "valueLabels"), "hide", "Option value should be 'hidden'");
	}
);

var showLabelsTest = new TestCase(
	"Show labels",
	function(){
		el.rangeSlider("option", "valueLabels", "show");
	},
	function(){
		QUnit.deepEqual($(".ui-rangeSlider-label").length, 2, "Value labels should have been detached");
		QUnit.deepEqual(el.rangeSlider("option", "valueLabels"), "show", "Option value should be 'hidden'");
	}
);

var changeBoundsTest = new TestCase(
	"Change bounds",
	function(){
		var bounds = { min:30, max:40 };
		this.getPositions();
		
		el.rangeSlider("option", "bounds", bounds);
	},
	function(){
		var bounds = { min:30, max:40 };
		
		QUnit.deepEqual(el.rangeSlider("option", "bounds").min, bounds.min, "Bounds setter should have worked");
		QUnit.deepEqual(el.rangeSlider("option", "bounds").max, bounds.max, "Bounds setter should have worked");
		QUnit.deepEqual(this.min(), bounds.min, "As the old values were outside the new bounds, values should have been updated");
		QUnit.deepEqual(this.max(), bounds.max, "As the old values were outside the new bounds, values should have been updated");
		
		this.assertDifferentPositions();
	}
);

var wheelModeZoomTest = new TestCase(
	"Zoom wheel mode",
	function(){
		el.rangeSlider("option", "bounds", {min: 0, max: 100});
		el.rangeSlider("option", "values", {min: 30, max: 40});
		el.rangeSlider("option", "wheelMode", "zoom");
	},
	function(){
		this.getPositions();
		this.getValues();
		$(".ui-rangeSlider-bar").trigger("mousewheel", [-10, 0, -10]);

		QUnit.deepEqual(el.rangeSlider("option", "wheelMode"), "zoom", "Wheelmode setter should have worked");
		QUnit.ok($(".ui-rangeSlider-leftHandle").offset().left < this.minHandlerPos, "Left handle should have been moved");
		QUnit.ok($(".ui-rangeSlider-rightHandle").offset().left > this.maxHandlerPos, "Right handle should have been moved");
		QUnit.ok($(".ui-rangeSlider-leftLabel").offset().left < this.minLabelPos, "Left label should have been moved");
		QUnit.ok($(".ui-rangeSlider-rightLabel").offset().left > this.maxLabelPos, "Right label should have been moved");
		
		QUnit.ok(this.min() < this.values.min, "Zoom should have worked");
		QUnit.ok(this.max() > this.values.max, "Zoom should have worked");
	}
);

function scrollAssert(){
	this.getValues();
	this.getPositions();
	el.find(".ui-rangeSlider-container").trigger("mousewheel", [-10, 0, -10]);

	QUnit.deepEqual(el.rangeSlider("option", "wheelMode"), "scroll", "Wheelmode setter should have worked");
	
	QUnit.ok($(".ui-rangeSlider-leftHandle").offset().left > this.minHandlerPos, "Left handle should have been moved");
	QUnit.ok($(".ui-rangeSlider-rightHandle").offset().left > this.maxHandlerPos, "Right handle should have been moved");
	QUnit.ok($(".ui-rangeSlider-leftLabel").offset().left > this.minLabelPos, "Left label should have been moved");
	QUnit.ok($(".ui-rangeSlider-rightLabel").offset().left > this.maxLabelPos, "Right label should have been moved");
	
	QUnit.ok(this.min() > this.values.min, "Scroll should have worked");
	QUnit.ok(this.max() > this.values.max, "Scroll should have worked");
	QUnit.equalEpsilon(this.min() - this.values.min, this.max() - this.values.max, 1e-3, "Scrolling must add or remove the deepEqual value on both ends");

}

var wheelModeScrollTest = new TestCase(
	"Scroll wheel mode",
	function(){
		el.rangeSlider({
			wheelMode: "scroll",
			bounds: {min: 0, max: 100}
		});

		el.rangeSlider("values", 30, 40);
	},
	scrollAssert
);

var wheelModeConstructorTest = new TestCase(
	"Wheel mode in constructor",
	function(){
		el.rangeSlider("destroy");
	
		el.rangeSlider({
			wheelMode: "scroll",
			defaultValues: {
				min: 30, 
				max: 40
			}
		});
	},
	scrollAssert
);

var wheelModeSetterTest = new TestCase(
	"Wheel mode setter test",
	function(){},
	function(){
		el.rangeSlider("option", "wheelMode", "badValue");
		QUnit.deepEqual(el.rangeSlider("option", "wheelMode"), "scroll", "Wheelmode setter with a bad value should not have worked");
		
		el.rangeSlider("option", "wheelMode", null);
		QUnit.deepEqual(el.rangeSlider("option", "wheelMode"), null, "Null wheelmode should disable mouse wheel");
	}
);

var wheelSpeedSetterTest = new TestCase(
	"Wheel speed setter",
	function(){},
	function(){
		el.rangeSlider("option", "wheelSpeed", 2);
		QUnit.deepEqual(el.rangeSlider("option", "wheelSpeed"), 2, "Wheelspeed setter should have worked");	
		
		el.rangeSlider("option", "wheelSpeed", null);
		QUnit.deepEqual(el.rangeSlider("option", "wheelSpeed"), 2, "Wheelspeed setter should not have worked");	

		el.rangeSlider("option", "wheelSpeed", "badValue");
		QUnit.deepEqual(el.rangeSlider("option", "wheelSpeed"), 2, "Wheelspeed setter should not have worked");	

		el.rangeSlider("option", "wheelSpeed", 0);
		QUnit.deepEqual(el.rangeSlider("option", "wheelSpeed"), 2, "Wheelspeed setter should not have worked");

		el.rangeSlider("option", "wheelSpeed", -3);
		QUnit.deepEqual(el.rangeSlider("option", "wheelSpeed"), -3, "Wheelspeed setter should have worked");
	}
);

var rangeSetterTest = new TestCase(
	"Range constraints",
	function(){},
	function(){
		var def = false;
		el.rangeSlider("option", "range", null);
		QUnit.deepEqual(el.rangeSlider("option", "range"), def, "Default value should be an object");
		
		el.rangeSlider("option", "range", false);
		QUnit.deepEqual(el.rangeSlider("option", "range"), def, "Default value should be an object");
		
		el.rangeSlider("option", "range", {min: 3});
		QUnit.deepEqual(el.rangeSlider("option", "range"), {min: 3, max: false}, "Default value for max value should be false");
		
		el.rangeSlider("option", "range", {min: 3, max: 4});
		QUnit.deepEqual(el.rangeSlider("option", "range"), {min: 3, max: 4}, "Setter should work");
		
		el.rangeSlider("option", "range", {min: false});
		QUnit.deepEqual(el.rangeSlider("option", "range"), {min: false, max: 4}, "Setter should only change sent values");
		
		el.rangeSlider("option", "range", false);
		QUnit.deepEqual(el.rangeSlider("option", "range"), def, "Range deactivation should work");
	}
);

/**
 *  Arrows
 */
var noArrowsSetterTest = new TestCase(
	"Arrows property setter",
	function(){
		el.rangeSlider("option", "arrows", false);
	},
	function(){
		QUnit.ok(!el.hasClass("ui-rangeSlider-withArrows"), "The parent element should not have the class withArrows");
		QUnit.ok(el.hasClass("ui-rangeSlider-noArrow"), "The parent element should have the class noArrows");
		
		var arrows = el.find(".ui-rangeSlider-arrow");
		QUnit.ok(arrows.length, 2, "2 arrows should be present");
		QUnit.deepEqual($(arrows[0]).css("display"), "none", "Arrows should not be displayed");
		QUnit.deepEqual($(arrows[1]).css("display"), "none", "Arrows should not be displayed");
	}
);

var arrowsScrollingMouseUpTest = new TestCase(
	"Mouseup on another element than arrows",
	function(){
		el.rangeSlider("max", el.rangeSlider("option", "bounds").max - 0.2);
		el.find(".ui-rangeSlider-rightArrow").trigger("mousedown");
		$(document).trigger("mouseup");
		this.delay = 500;
	},
	function(){
		// mouseup on another element than the clicked arrow should stop scrolling
		QUnit.ok(this.max() !== el.rangeSlider("option", "bounds").max, "mouseup on another element than the clicked arrow should stop scrolling");
	}
);

/*
 * Public methods
 */
var valuesSetter = new TestCase(
	"Values setter",
	function(){
		this.previousResult = el.rangeSlider("values", 21, 22);
	},
	function(){
		QUnit.equalEpsilon(this.previousResult.min, 21, 1e-6, "Method should have returned the good min value");
		QUnit.equalEpsilon(this.previousResult.max, 22, 1e-6, "Method should have returned the good max value");
		
		var values = el.rangeSlider("values");
		QUnit.equalEpsilon(values.min, 21, 1e-6, "Min value should have been set");
		QUnit.equalEpsilon(values.max, 22, 1e-6, "Max value should have been set");
	}
);

var changeValuesTest = new TestCase(
	"Change values",
	function(){
		el.rangeSlider("values", 100, 100);
		el.rangeSlider("values", 20, 50);
	},
	function(){
		var values = {min: 20, max: 50};

		QUnit.deepEqualEpsilon(el.rangeSlider("values"), values, 1e-3, "Values should be correct");
	}
);

var minMaxSetter = new TestCase(
	"Min & max setters",
	function(){
		this.min = 5;
		this.max = 42;
		
		this.minResult = el.rangeSlider("min", this.min);
		this.maxResult = el.rangeSlider("max", this.max);
	},
	function(){
		QUnit.equalEpsilon(this.minResult, this.min, 1e-3, "Min setter should return the new value");
		QUnit.equalEpsilon(this.maxResult, this.max, 1e-3, "Max setter should return the new value");
		
		QUnit.equalEpsilon(el.rangeSlider("min"), this.min, 1e-3, "Min getter should return the new value");
		QUnit.equalEpsilon(el.rangeSlider("max"), this.max, 1e-3, "Max getter should return the new value");
	}
);

var boundsSetter = new TestCase(
	"Bounds setter",
	function(){
		this.bounds = {min: 10, max: 20}
		this.result = el.rangeSlider("bounds", this.bounds.min, this.bounds.max);
		this.delay = 500;
	},
	function(){
		QUnit.deepEqual(this.result, this.bounds, "Should return the new value");
		QUnit.deepEqual(el.rangeSlider("bounds"), this.bounds, "Should return the value");
		
		QUnit.deepEqual(el.rangeSlider("min"), this.bounds.min, "Min value should have been changed");
		QUnit.deepEqual(el.rangeSlider("max"), this.bounds.max, "Max value should have been changed");
	}
);

var zoomInTest = new TestCase(
	"Zoom In",
	function(){
		this.getValues();
		el.rangeSlider("zoomIn", 2);
	},
	function(){
		QUnit.ok(this.min() > this.values.min, "Min value should have been increased");
		QUnit.ok(this.max() < this.values.max, "Min value should have been decreased");
	}
);

var zoomOutTest = new TestCase(
	"Zoom Out",
	function(){
		this.getValues();
		el.rangeSlider("zoomOut", 2);
	},
	function(){
		QUnit.ok(this.min() < this.values.min, "Min value should have been decreased");
		QUnit.ok(this.max() > this.values.max, "Min value should have been increased");
	}
);

var scrollLeftTest = new TestCase(
	"Scroll left",
	function(){
		el.rangeSlider("values", 12, 13);
		this.getValues();
		el.rangeSlider("scrollLeft", 2);
	},
	function(){
		QUnit.ok(this.min() < this.values.min, "Min value should have been decreased");
		QUnit.ok(this.max() < this.values.max, "Min value should have been decreased");
	}
);

var scrollRightTest = new TestCase(
	"Scroll right",
	function(){
		el.rangeSlider("values", 12, 13);
		this.getValues();
		el.rangeSlider("scrollRight", 2);
	},
	function(){
		QUnit.ok(this.min() > this.values.min, "Min value should have been increased");
		QUnit.ok(this.max() > this.values.max, "Min value should have been increased");
	}
);

var issue12 = new TestCase(
	"Issue 12",
	function(){
		el.rangeSlider("option", "bounds", {min:0, max:100});
		el.rangeSlider("values", 0, 100);
		var leftHandle = el.find(".ui-rangeSlider-leftHandle");
		
		leftHandle.simulate("drag", {
			dx: el.find(".ui-rangeSlider-container").innerWidth() - leftHandle.position().left,
			dy: 0
		});
				
		this.delay = 100;
	},
	function(){
		QUnit.equal(this.min(), 100, "Both values should be 100");
	}
)

var rangeLimitMax = new TestCase(
	"Range limit (max)",
	function(){
		el.rangeSlider("option", "range", {max:50});
		el.rangeSlider("values", 0, 20);
	},
	function(){
		var rightHandle = el.find(".ui-rangeSlider-rightHandle");
		
		rightHandle.simulate("drag", {
			dx: el.find(".ui-rangeSlider-container").innerWidth() - rightHandle.position().left - rightHandle.outerWidth(true),
			dy: 0
		});
		
		QUnit.equal(this.max(), 50);
	}
);

var rangeLimitMaxWithMinAndMax = new TestCase(
	"Range limit (max with min and max)",
	function(){
		el.rangeSlider("option", "range", {min: 10, max:50});
		el.rangeSlider("values", 0, 20);
	},
	function(){
		var rightHandle = el.find(".ui-rangeSlider-rightHandle");
		
		rightHandle.simulate("drag", {
			dx: el.find(".ui-rangeSlider-container").innerWidth() - rightHandle.position().left - rightHandle.outerWidth(true),
			dy: 0
		});
		
		QUnit.equal(this.max(), 50);
	}
);

var rangeLimitMin = new TestCase(
	"Range limit (min)",
	function(){
		el.rangeSlider("option", "range", false);
		el.rangeSlider("option", "range", {min:50});
		el.rangeSlider("values", 0, 70);
	},
	function(){
		var rightHandle = el.find(".ui-rangeSlider-rightHandle");
		
		rightHandle.simulate("drag", {
			dx: - rightHandle.position().left,
			dy: 0
		});
		
		QUnit.equal(this.max(), 50);
	}
);

var rangeLimitMinWithMinAndMax = new TestCase(
	"Range limit (min with min and max)",
	function(){
		el.rangeSlider("option", "range", {min:50, max:90});
		el.rangeSlider("values", 0, 70);
	},
	function(){
		var rightHandle = el.find(".ui-rangeSlider-rightHandle");
		
		rightHandle.simulate("drag", {
			dx: - rightHandle.position().left,
			dy: 0
		});
		
		QUnit.equal(this.max(), 50);
	}
);

var rulerTest = new TestCase(
	"Scales option setter",
	function(){
		initEl();
		el.rangeSlider();
		el.rangeSlider("option", "scales", [{}]);
	},
	function(){
		var option = el.rangeSlider("option", "scales"),
			container = el.find(".ui-rangeSlider-ruler"),
			scale = container.find(".ui-ruler-scale"),
			ticks = scale.find(".ui-ruler-tick");

		QUnit.notEqual(option, false, "Option should have been set");
		QUnit.deepEqual(option.length, 1, "Should return an array");
		QUnit.equal(container.length, 1, "One scale container should have been created");
		QUnit.equal(scale.length, 1, "One scale should have been created");
		QUnit.equal(ticks.length, 100, "Ticks should have been created");

		el.rangeSlider("destroy");
		el.empty();
	}
);

var rulerInCtor = new TestCase(
	"Set scales option in constructor",
	function(){
		initEl();
		el.rangeSlider({
			scales: [{}]
		});
	},
	function(){
		QUnit.equal(el.find(".ui-ruler-tick").length, 100, "Ticks should have been created");
		el.rangeSlider("destroy");
		el.empty();
	}
);

var updateRulerTest = new TestCase(
	"Update scale when setting bounds",
	function(){
		initEl();
		el.rangeSlider({
			scales: [{}]
		});
	},
	function(){
		var ticks = el.find(".ui-ruler-tick");
		QUnit.equal(ticks.length, 100, "100 ticks should have been created");

		el.rangeSlider({
			bounds: {min: 0, max: 50}
		});

		QUnit.equal(el.find(".ui-ruler-tick").length, 50, "Ruler should have been updated");

		el.rangeSlider("destroy");
		el.empty();
	}
);

function assertIsDisabledAndDestroy(){
	QUnit.ok(!el.rangeSlider("option", "enabled"), "RangeSlider is disabled");
	QUnit.ok(el.hasClass("ui-rangeSlider-disabled"), "Disabled class added");

	el.rangeSlider("destroy");
	el.empty();
}

function assertIsEnabledAndDestroy(){
	QUnit.ok(el.rangeSlider("option", "enabled"), "RangeSlider is disabled");
	QUnit.ok(!el.hasClass("ui-rangeSlider-disabled"), "Disabled class added");

	el.rangeSlider("destroy");
	el.empty();
}

var disableInCtorTest = new TestCase(
	"Disable in constructor test",
	function(){
		initEl();
		el.rangeSlider({
			enabled: false
		});
	},
	assertIsDisabledAndDestroy
);

var disableWithFunctions = new TestCase(
	"Disable slider with functions",
	function(){
		initEl();
		el.rangeSlider();
		el.rangeSlider("disable");
	},
	assertIsDisabledAndDestroy
);

var disableWithOption = new TestCase(
	"Disable slider with option",
	function(){
		initEl();
		el.rangeSlider();
		el.rangeSlider("option", "enabled", false);
	},
	assertIsDisabledAndDestroy
);

var enableWithFunction = new TestCase(
	"Enable with functions",
	function(){
		initEl();
		el.rangeSlider({
			enabled: false
		});
		el.rangeSlider("enable");
	},
	assertIsEnabledAndDestroy
);

var enableWithOption = new TestCase(
	"Enable slider with option",
	function(){
		initEl();
		el.rangeSlider({
			enabled: false
		});
		el.rangeSlider("option", "enabled", true);
	},
	assertIsEnabledAndDestroy
);

function assertSameValuesAndDestroy(){
	var values = el.rangeSlider("values");

	QUnit.equalEpsilon(values.min, 20, 1e-6, "Min value should not have changed");
	QUnit.equalEpsilon(values.max, 50, 1e-6, "Max value should not have changed");

	el.rangeSlider("destroy");
	el.empty();
}

function setupDisabledDragTest(selector){
	initEl();
	el.rangeSlider({
		enabled: false
	});

	setTimeout(function(){
		el.find(selector).simulate("drag", {
			dx: 20,
			dy: 0
		});
	}, 100);
}

var barDragDisabled = new TestCase(
	"Check that the slider is really disabled",
	function(){
		setupDisabledDragTest(".ui-rangeSlider-bar");
		this.delay = 500;
	},
	assertSameValuesAndDestroy
);

var handleDragDisabled = new TestCase(
	"Check that handles are disabled",
	function(){
		setupDisabledDragTest(".ui-rangeSlider-leftHandle");
		this.delay = 500;
	},
	assertSameValuesAndDestroy
);

var labelDragDisabled = new TestCase(
	"Check that labels are disabled",
	function(){
		setupDisabledDragTest(".ui-rangeSlider-leftLabel");
		this.delay = 500;
	},
	assertSameValuesAndDestroy
);

var arrowClickDisabled = new TestCase(
	"Check that arrows are disabled",
	function(){
		initEl();
		el.rangeSlider({
			enabled: false
		});
		this.delay = 500;
		setTimeout(function(){
			el.find(".ui-rangeSlider-leftArrow").mousedown();
			el.find(".ui-rangeSlider-leftArrow").mouseup();
		}, 100);
	},
	assertSameValuesAndDestroy
);

testRunner.add("jQRangeSlider", [setUp,
			defaultCtorTest, hideLabelsTest, showLabelsTest, changeBoundsTest,
			wheelModeZoomTest, wheelModeScrollTest, wheelModeSetterTest, wheelSpeedSetterTest, rangeSetterTest,
			wheelModeConstructorTest,
			noArrowsSetterTest, arrowsScrollingMouseUpTest,
			defaultSetup,
			customCtorTest,
			destroy,
			defaultCtorTest,
			valuesSetter, changeValuesTest, minMaxSetter, boundsSetter,
			zoomInTest, zoomOutTest, scrollLeftTest, scrollRightTest,
			issue12,
			rangeLimitMax, rangeLimitMaxWithMinAndMax, rangeLimitMin, rangeLimitMinWithMinAndMax,
			destroyTest,
			rulerTest, rulerInCtor, updateRulerTest,
			disableInCtorTest, disableWithFunctions, disableWithOption, enableWithFunction, enableWithOption,
			barDragDisabled, handleDragDisabled, labelDragDisabled, arrowClickDisabled]);

}());

