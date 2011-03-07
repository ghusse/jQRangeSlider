/* jQRangeSlider
 * A javascript slider selector that supports dates
 * 
 * Copyright (C) Guillaume Gautreau 2010
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * jQRangeSlider
 */
 
var el = null;

var defaultCtorTest = new TestCase(
	"Default ctor",
	function(){
		el.rangeSlider();
	},
	function() {
		// Default values tests
		deepEqual(el.rangeSlider("option", "bounds"), { min:0, max:100 }, "Default bounds should be 0-100");
		deepEqual(el.rangeSlider("option", "defaultValues"), {min:20, max:50}, "Default values should be 20-50");
		equal(el.rangeSlider("option", "wheelMode"), null, "Default wheel mode should be empty");
		equal(el.rangeSlider("option", "wheelSpeed"), 4, "Default wheel mode should be empty");
		ok(el.rangeSlider("option", "arrows"), "Arrows should be activated by default");
		equal(el.rangeSlider("option", "valueHelpers"), "change", "Value helpers should be activated on value changes by default");
		equal(el.rangeSlider("option", "formatter"), null, "Default formatter should be used (null value)");
		equal(el.rangeSlider("option", "durationIn"), 0, "Default duration for showing helpers is 0ms");
		equal(el.rangeSlider("option", "durationOut"), 400, "Default duration for hiding helpers is 400ms");
		equal(el.rangeSlider("option", "delayOut"), 200, "Default delay before hiding helpers is 200ms");
		
		// Created elements
		equal($(".ui-rangeSlider-handle.ui-rangeSlider-leftHandle").length, 1, "Left handle should have been created");
		equal($(".ui-rangeSlider-handle.ui-rangeSlider-rightHandle").length, 1, "Right handle should have been created");
		equal($(".ui-rangeSlider-helper.ui-rangeSlider-leftHelper").length, 1, "Left helper should have been created");
		equal($(".ui-rangeSlider-helper.ui-rangeSlider-rightHelper").length, 1, "Right helper should have been created");
		
		// Arrows
		equal($(".ui-rangeSlider-arrow.ui-rangeSlider-leftArrow").length, 1, "Left arrow should have been created");
		equal($(".ui-rangeSlider-arrow.ui-rangeSlider-rightArrow").length, 1, "Right arrow should have been created");
		equal($(".ui-rangeSlider-arrow.ui-rangeSlider-leftArrow").css("display"), "block", "Left arrow should have been created");
		equal($(".ui-rangeSlider-arrow.ui-rangeSlider-rightArrow").css("display"), "block", "Arrows should be visible");
		ok(el.hasClass("ui-rangeSlider-withArrows"), "ui-rangeSlider-withArrows should be applied to the parent element");
		
		// Bars
		equal($(".ui-rangeSlider-innerBar").length, 1, "The inner bar should have been created");
		equal($(".ui-rangeSlider-bar").length, 1, "The bar should have been created");
		
		equal($(".ui-rangeSlider-container").outerWidth(true), el.innerWidth(), "Container");
		
		// Values
		equal(el.rangeSlider("values").min, 20, "Values should be equal to the default values");
		equal(el.rangeSlider("values").max, 50, "Values should be equal to the default values");
		
	}
);

var destroyTest = new TestCase(
	"Destroy",
	function(){
	},
	function(){
		el.rangeSlider("destroy");
		
		equal(el.children().length, 0, "Parent element should be empty");
		equal(el.attr("class"), "", "Class attribute on parent element should be empty");
	}
);

var hideHelpersTest = new TestCase(
	"Hide helpers",
	function(){
		el.rangeSlider("option", "valueHelpers", "hide");
	},
	function(){
		equal($(".ui-rangeSlider-helper").length, 0, "Value helpers should have been detached");
		equal(el.rangeSlider("option", "valueHelpers"), "hide", "Option value should be 'hidden'");
	}
);

var showHelpersTest = new TestCase(
	"Show helpers",
	function(){
		el.rangeSlider("option", "valueHelpers", "show");
	},
	function(){
		equal($(".ui-rangeSlider-helper").length, 2, "Value helpers should have been detached");
		equal(el.rangeSlider("option", "valueHelpers"), "show", "Option value should be 'hidden'");
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
		
		equal(el.rangeSlider("option", "bounds").min, bounds.min, "Bounds setter should have worked");
		equal(el.rangeSlider("option", "bounds").max, bounds.max, "Bounds setter should have worked");
		equal(el.rangeSlider("values").min, bounds.min, "As the old values were outside the new bounds, values should have been updated");
		equal(el.rangeSlider("values").max, bounds.max, "As the old values were outside the new bounds, values should have been updated");
		
		this.assertDifferentPositions();
	}
);

var wheelModeZoomTest = new TestCase(
	"Zoom wheel mode",
	function(){
		el.rangeSlider("option", "wheelMode", "zoom");
		this.getPositions();
		this.getValues();
		$(".ui-rangeSlider-bar").trigger("mousewheel", [-10, 0, -10]);
	},
	function(){
		equal(el.rangeSlider("option", "wheelMode"), "zoom", "Wheelmode setter should have worked");
		ok($(".ui-rangeSlider-leftHandle").offset().left > this.minHandlerPos, "Left handle should have been moved");
		ok($(".ui-rangeSlider-rightHandle").offset().left < this.maxHandlerPos, "Right handle should have been moved");
		ok($(".ui-rangeSlider-leftHelper").offset().left > this.minHelperPos, "Left helper should have been moved");
		ok($(".ui-rangeSlider-rightHelper").offset().left < this.maxHelperPos, "Right helper should have been moved");
		
		ok(el.rangeSlider("values").min > this.values.min, "Zoom should have worked");
		ok(el.rangeSlider("values").max < this.values.max, "Zoom should have worked");
	}
);

var wheelModeScrollTest = new TestCase(
	"Scroll wheel mode",
	function(){
		el.rangeSlider("option", "wheelMode", "scroll");
		this.getValues();
		this.getPositions();
		el.find(".ui-rangeSlider-container").trigger("mousewheel", [-10, 0, -10]);
	},
	function(){
		equal(el.rangeSlider("option", "wheelMode"), "scroll", "Wheelmode setter should have worked");
		
		ok($(".ui-rangeSlider-leftHandle").offset().left > this.minHandlerPos, "Left handle should have been moved");
		ok($(".ui-rangeSlider-rightHandle").offset().left > this.maxHandlerPos, "Right handle should have been moved");
		ok($(".ui-rangeSlider-leftHelper").offset().left > this.minHelperPos, "Left helper should have been moved");
		ok($(".ui-rangeSlider-rightHelper").offset().left > this.maxHelperPos, "Right helper should have been moved");
		
		ok(el.rangeSlider("values").min > this.values.min, "Scroll should have worked");
		ok(el.rangeSlider("values").max > this.values.max, "Scroll should have worked");
		equal(el.rangeSlider("values").min - this.values.min, el.rangeSlider("values").max - this.values.max, "Scrolling must add or remove the same value on both ends");
	}
);

var wheelModeSetterTest = new TestCase(
	"Wheel mode setter test",
	function(){},
	function(){
		el.rangeSlider("option", "wheelMode", "badValue");
		equal(el.rangeSlider("option", "wheelMode"), "scroll", "Wheelmode setter with a bad value should not have worked");
		
		el.rangeSlider("option", "wheelMode", null);
		equal(el.rangeSlider("option", "wheelMode"), null, "Wheelmode setter with a bad value should not have worked");
	}
);

var wheelSpeedSetterTest = new TestCase(
	"Wheel speed setter",
	function(){},
	function(){
		el.rangeSlider("option", "wheelSpeed", 2);
		equal(el.rangeSlider("option", "wheelSpeed"), 2, "Wheelspeed setter should have worked");	
		
		el.rangeSlider("option", "wheelSpeed", null);
		equal(el.rangeSlider("option", "wheelSpeed"), 2, "Wheelspeed setter should not have worked");	

		el.rangeSlider("option", "wheelSpeed", "badValue");
		equal(el.rangeSlider("option", "wheelSpeed"), 2, "Wheelspeed setter should not have worked");	
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
		ok(!el.hasClass("ui-rangeSlider-withArrows"), "The parent element should not have the class withArrows");
		ok(el.hasClass("ui-rangeSlider-noArrow"), "The parent element should have the class noArrows");
		
		var arrows = el.find(".ui-rangeSlider-arrow");
		ok(arrows.length, 2, "2 arrows should be present");
		equal($(arrows[0]).css("display"), "none", "Arrows should not be displayed");
		equal($(arrows[1]).css("display"), "none", "Arrows should not be displayed");
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
		ok(el.rangeSlider("values").max != el.rangeSlider("option", "bounds").max, "mouseup on another element than the clicked arrow should stop scrolling");
	}
);

$(document).ready(
	function(){
		module("jQRangeSlider");
	
		el = $("#test");
		
		var jQRangeSliderTester = new TestRunner("jQRangeSliderTester",[defaultCtorTest, hideHelpersTest, showHelpersTest, changeBoundsTest,
			wheelModeZoomTest, wheelModeScrollTest, wheelModeSetterTest, wheelSpeedSetterTest,
			noArrowsSetterTest, arrowsScrollingMouseUpTest,
			destroyTest]);
		jQRangeSliderTester.launch();
	}
);