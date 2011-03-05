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
 	
 function destroyTest(){
 	test("destroying", function(){
		el.rangeSlider("destroy");
		
		equal(el.children().length, 0, "Parent element should be empty");
		equal(el.attr("class"), "", "Class attribute on parent element should be empty");
	});
 }
 
$(document).ready(function(){
 
	module("jQRangeSlider");
	
	el = $("#test");
		
	// Default ctor test
	test("Default ctor", function(){
		el.rangeSlider();

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
		equal($(".ui-rangeSlider-arrow.ui-rangeSlider-leftArrow").length, 1, "Left arrow should have been created");
		equal($(".ui-rangeSlider-arrow.ui-rangeSlider-rightArrow").length, 1, "Right arrow should have been created");
		equal($(".ui-rangeSlider-innerBar").length, 1, "The inner bar should have been created");
		equal($(".ui-rangeSlider-bar").length, 1, "The bar should have been created");
	});
	
	test("Value helpers", function(){
		// Due to a problem with the detach method, we have to test the helpers after a ctor
		el.rangeSlider("destroy");
		el.rangeSlider({ valueHelpers: "hide" });
	
		equal($(".ui-rangeSlider-helper").length, 0, "Value helpers should have been detached");
		equal(el.rangeSlider("option", "valueHelpers"), "hide", "Option value should be 'hidden'");
		
		// Verify that elements are created
		destroyTest();
		el.rangeSlider({ valueHelpers: "change" });
		equal($(".ui-rangeSlider-helper").length, 2, "Value helpers should have been created for the 'change' value");
		equal($(".ui-rangeSlider-helper.ui-rangeSlider-leftHelper").length, 1, "Value helpers should have been created for the 'change' value");
		equal($(".ui-rangeSlider-helper.ui-rangeSlider-rightHelper").length, 1, "Value helpers should have been created for the 'change' value");
		equal(el.rangeSlider("option", "valueHelpers"), "change", "Option value should be 'change'");
		
		// Force the value helpers to be shown
		destroyTest();
		el.rangeSlider({ valueHelpers: "show" });
		equal($(".ui-rangeSlider-helper").length, 2, "Value helpers should have been created");
		equal(el.rangeSlider("option", "valueHelpers"), "show", "Option value should be 'show'");
	});
	
	test("Verify bounds setter", function(){
		// force helpers to he shown
		var bounds = { min:30, max:40 };
		el.rangeSlider("option", "bounds", bounds);
		
		equal(el.rangeSlider("option", "bounds").min, bounds.min, "Bounds setter should have worked");
		equal(el.rangeSlider("option", "bounds").max, bounds.max, "Bounds setter should have worked");
		equal(el.rangeSlider("values").min, bounds.min, "As the old values were outside the new bounds, values should have been updated");
		equal(el.rangeSlider("values").max, bounds.max, "As the old values were outside the new bounds, values should have been updated");
		
		equal($(".ui-rangeSlider-handle.ui-rangeSlider-leftHandle").length, 1, "Left handle should have been created");
		equal($(".ui-rangeSlider-handle.ui-rangeSlider-rightHandle").length, 1, "Right handle should have been created");
		
		// Handle positions must have changed
		var left = $(".ui-rangeSlider-leftHandle").offset().left;
		var right = $(".ui-rangeSlider-rightHandle").offset().left;
		var leftH = $(".ui-rangeSlider-leftHelper").offset().left;
		var rightH = $(".ui-rangeSlider-rightHelper").offset().left;
		
		bounds = {min:0, max:200};
		el.rangeSlider("option", "bounds", bounds);
		
		notEqual($(".ui-rangeSlider-leftHandle").offset().left, left, "Left handle should have been moved");
		notEqual($(".ui-rangeSlider-rightHandle").offset().left, left, "Right handle should have been moved");

		notEqual($(".ui-rangeSlider-leftHelper").offset().left, leftH, "Left helper should have been moved");
		notEqual($(".ui-rangeSlider-rightHelper").offset().left, rightH, "Right helper should have been moved");
	});
	
	
	destroyTest();
});