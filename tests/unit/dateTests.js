/* jQRangeSlider
 * A javascript slider selector that supports dates
 * 
 * Copyright (C) Guillaume Gautreau 2010-2011
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

(function(){
	"use strict";

	var dateSetup = new TestCase(
		"Setup for dateRangeSlider",
		function(){
			var children = $("#test").children();
			for (var i = 0;i<children.length;i++){
				$(children[i]).remove();
			}
			
			el = $("#test");
		},
		null);

	var dateDefaultCtor = new TestCase(
		"Default date range slider Ctor",
		function(){
			el.dateRangeSlider();
		},
		function(){
			var bounds = el.dateRangeSlider("option", "bounds");
			var defaultValues = el.dateRangeSlider("option", "defaultValues");
			var values = el.dateRangeSlider("values");
			
			QUnit.ok(bounds.min instanceof Date, "Bounds min value should be a date");
			QUnit.ok(bounds.max instanceof Date, "Bounds max value should be a date");
			QUnit.deepEqual(bounds.min.toLocaleString(), new Date(2010,0,1).toLocaleString(), "Bounds min value should have been set to 2010-1-1");
			
			QUnit.ok(defaultValues.min instanceof Date, "Default min value should be a date");
			QUnit.ok(defaultValues.max instanceof Date, "Default max value should be a date");
			QUnit.ok(values.min instanceof Date, "Min value should be a date");
			QUnit.ok(values.max instanceof Date, "Min value should be a date");
			QUnit.deepEqual(values, defaultValues, "Default values should be equal to the defaultValues value");
			QUnit.ok(el.dateRangeSlider("min") instanceof Date, "Min should return a date");

			QUnit.ok(el.is(".ui-dateRangeSlider", "ui-dateRangeSlider class should have been added"));
		}
	);

	var dateDestroyTest = new TestCase(
		"Destroy",
		function(){
			el.dateRangeSlider("destroy");
		},
		function(){
			QUnit.deepEqual(el.children().length, 0, "Parent element should have no children");
			QUnit.deepEqual(el.attr("class"), "", "Class attribute on parent element should be empty");
		}
	);

	var dateDestroy = new TestCase(
		"Destroy",
		function(){
			el.dateRangeSlider("destroy");
		},
		null
	);

	var dateBoundsSetterTest = new TestCase(
		"Bounds setter",
		function(){
			this.bounds = {min: new Date(2007, 0, 1), max:new Date(2009, 0, 3)};
			
			el.dateRangeSlider("option", "bounds", this.bounds);
		},
		function(){
			var bounds = el.dateRangeSlider("option", "bounds");
			QUnit.ok(bounds.min instanceof Date, "Bounds min value should be a date");
			QUnit.ok(bounds.max instanceof Date, "Bounds max value should be a date");
			
			QUnit.equal(bounds.min.toLocaleString(), this.bounds.min.toLocaleString(), "Bounds min value should have been correctly set");
			QUnit.equal(bounds.max.toLocaleString(), this.bounds.max.toLocaleString(), "Bounds min value should have been correctly set");
		}
	);

	var customCtorTest = new TestCase(
		"Custom constructor",
		function(){
			this.defaultValues = {min: new Date(2007,0,1), max:new Date(2008,0,1)};
			this.bounds = {min:new Date(2007,1,1), max: new Date(2009,0,1)};
			this.value = null;
			
			this.formatter = function(value){
				this.value = value;
			}
			
			el.dateRangeSlider({
				defaultValues: this.defaultValues,
				bounds: this.bounds,
				formatter: $.proxy(this.formatter, this),
				valueLabels: "show"
			});
		},
		function(){
			var bounds = el.dateRangeSlider("option", "bounds");
			var defaultValues = el.dateRangeSlider("option", "defaultValues");
			QUnit.ok(bounds.min instanceof Date, "Bounds min value should be a date");
			QUnit.ok(bounds.max instanceof Date, "Bounds max value should be a date");
			QUnit.ok(defaultValues.min instanceof Date, "Default min value should be a date");
			QUnit.ok(defaultValues.max instanceof Date, "Default max value should be a date");
			QUnit.ok(this.value !== null, "Formatter should have been called");
			QUnit.ok(this.value instanceof Date, "Formatter should have received a date as argument");
			
			QUnit.deepEqual(defaultValues.min.toLocaleString(), this.defaultValues.min.toLocaleString(), "Default values should have been correctly set");
			QUnit.deepEqual(bounds.min.toLocaleString(), this.bounds.min.toLocaleString(), "Default values should have been correctly set");
		}
	);

	var dateValuesSetterTest = new TestCase(
		"Values setter method",
		function(){
			this.values = {min: new Date(2010,2,1), max: new Date(2010,6,1)};
			
			this.result = el.dateRangeSlider("values", this.values.min, this.values.max);
		},
		function(){
			this.testResults = function(){
				QUnit.ok(this.result.min instanceof Date, "Returned values should be dates");
				QUnit.ok(this.result.max instanceof Date, "Returned values should be dates");
				QUnit.deepEqual(this.result.min.toLocaleString(), this.values.min.toLocaleString(), "Minimum value should have been correctly set and returned");
				QUnit.deepEqual(this.result.max.toLocaleString(), this.values.max.toLocaleString(), "Minimum value should have been correctly set and returned");
			}
			
			this.testResults();
			this.result = el.dateRangeSlider("values");
			this.testResults();
		}
	);

	var minMaxSetterTest = new TestCase(
		"Min & max setters",
		function(){
			this.min = new Date(2010,5,5);
			this.minResult = el.dateRangeSlider("min", this.min);
			
			this.max = new Date(2010,6,6);
			this.maxResult = el.dateRangeSlider("max", this.max);
		},
		function(){
			QUnit.ok(this.minResult instanceof Date, "Returned value should be a date");
			QUnit.ok(this.maxResult instanceof Date, "Returned value should be a date");
			QUnit.deepEqual(this.minResult.toLocaleString(), this.min.toLocaleString(), "Min method should have returned the value");
			QUnit.deepEqual(this.maxResult.toLocaleString(), this.max.toLocaleString(), "Max method should have returned the value");
			
			QUnit.deepEqual(el.dateRangeSlider("min").toLocaleString(), this.min.toLocaleString(), "Min getter should return the new value");
			QUnit.deepEqual(el.dateRangeSlider("max").toLocaleString(), this.max.toLocaleString(), "Max getter should return the new value");
		}
	);

	var boundsSetter = new TestCase(
		"Bounds setter",
		function(){},
		function(){
			el.dateRangeSlider("values", new Date(2010, 0, 1), new Date(2012, 0, 1));

			var b = {min: new Date(2010, 5, 1), max: new Date(2010, 6, 1)};
			
			QUnit.deepEqual(el.dateRangeSlider("bounds", b.min, b.max), b, "Should return the new value");
			QUnit.deepEqual(el.dateRangeSlider("bounds"), b, "Should return the new value");
			
			QUnit.equal(el.dateRangeSlider("min").toLocaleString(), b.min.toLocaleString());
			QUnit.equal(el.dateRangeSlider("max").toLocaleString(), b.max.toLocaleString());
		}
	);
		
	testRunner.add("jQDateRangeSlider", 
		[dateSetup,
			dateDefaultCtor,
			dateBoundsSetterTest,
			dateDestroy,
			customCtorTest,
			dateDestroy,
			dateDefaultCtor,
			dateValuesSetterTest,	minMaxSetterTest, boundsSetter,
			dateDestroyTest]);
}());