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
	});
	
	
	
	destroyTest();
});