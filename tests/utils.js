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
 
function TestCase(_name, _setup, _check){
	this.name = _name;
	this.setup = _setup;
	this.check = _check;
	
	this.getPositions = function(){
		this.minHandlerPos = $(".ui-rangeSlider-leftHandle").offset().left;
		this.maxHandlerPos = $(".ui-rangeSlider-rightHandle").offset().left;
		this.minHelperPos = $(".ui-rangeSlider-leftHelper").offset().left;
		this.maxHelperPos = $(".ui-rangeSlider-rightHelper").offset().left;
	}
	
	this.assertDifferentPositions = function(){
		notEqual($(".ui-rangeSlider-leftHandle").offset().left, this.minHandlerPos, "Left handle should have been moved");
		notEqual($(".ui-rangeSlider-rightHandle").offset().left, this.maxHandlerPos, "Right handle should have been moved");
		notEqual($(".ui-rangeSlider-leftHelper").offset().left, this.minHelperPos, "Left helper should have been moved");
		notEqual($(".ui-rangeSlider-rightHelper").offset().left, this.maxHelperPos, "Right helper should have been moved");
	}
}

TestRunner = function(_module, _tests){
	this.module = _module;
	this.tests = _tests;
	this.index = 0;
	
	this.launch = function(){
		module(this.module);
		this.next();
		
	}
	
	this.next = function(){
		if (this.tests.length > this.index){
			var test = this.tests[this.index];
			test.setup();
			setTimeout($.proxy(this.check, this), 100);
		}
	}
	
	this.check = function(){
		var testCase = this.tests[this.index];
		test(testCase.name, function(){
			testCase.check();
		});
		
		this.index++;
		this.next();
	}
}