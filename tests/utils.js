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
 
function TestCase(_name, _setup, _check, _tearDown){
	this.name = _name;
	this.setup = _setup;
	this.check = _check;
	this.tearDown = _tearDown;
	this.delay = 100;
	
	this.getPositions = function(){
		this.minHandlerPos = $(".ui-rangeSlider-leftHandle").offset().left;
		this.maxHandlerPos = $(".ui-rangeSlider-rightHandle").offset().left;
		this.minLabelPos = $(".ui-rangeSlider-leftLabel").offset().left;
		this.maxLabelPos = $(".ui-rangeSlider-rightLabel").offset().left;
	}
	
	this.getValues = function(){
		this.values = $("#test").rangeSlider("values");
	}
	
	this.assertDifferentPositions = function(){
		notEqual($(".ui-rangeSlider-leftHandle").offset().left, this.minHandlerPos, "Left handle should have been moved");
		notEqual($(".ui-rangeSlider-rightHandle").offset().left, this.maxHandlerPos, "Right handle should have been moved");
		notEqual($(".ui-rangeSlider-leftLabel").offset().left, this.minLabelPos, "Left label should have been moved");
		notEqual($(".ui-rangeSlider-rightLabel").offset().left, this.maxLabelPos, "Right label should have been moved");
	}
	
	this.min = function(){
		return el.rangeSlider("values").min;
	}
	
	this.max = function(){
		return el.rangeSlider("values").max;
	}
}

TestRunner = function(){
	this.module = "";
	this.tests = new Array();
	this.index = 0;
	
	this.launch = function(){
		module(this.module);
		this.next();
	}
	
	this.next = function(){
		if (this.tests.length > this.index){
			var test = this.tests[this.index];
			if (test.setup)	test.setup();
			setTimeout($.proxy(this.check, this), test.delay);
		}
	}
	
	this.check = function(){
		var testCase = this.tests[this.index];
		if (testCase.check){
			if (this.module != testCase.module){
				module(testCase.module);
				this.module = testCase.module;
			}
			
			test(testCase.name, function(){
				testCase.check();
			});
		}
		
		if (testCase.tearDown){
			testCase.tearDown();
		}
		
		this.index++;
		this.next();
	},
	
	this.add = function(module, tests){
		if (tests instanceof Array){
			for (var i=0; i<tests.length; i++) tests[i].module = module;
			
			this.tests = this.tests.concat(tests);
		}else if (tests instanceof TestCase){
			tests.module = module;
			this.tests.append(tests);
		}
	}
}

var testRunner = new TestRunner();
$(document).ready(
	function(){
		testRunner.launch();
	}
);