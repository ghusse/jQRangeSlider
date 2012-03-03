/* jQRangeSlider
 * A javascript slider selector that supports dates
 * 
 * Copyright (C) Guillaume Gautreau 2010
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
 
function TestCase(_name, _setup, _check, _tearDown){
	this.name = _name;
	this.setup = _setup;
	this.check = _check;
	this.tearDown = _tearDown;
	this.delay = 100;
	this.type = "rangeSlider",

	this.getPositions = function(){
		this.minHandlerPos = $(".ui-rangeSlider-leftHandle").offset().left;
		this.maxHandlerPos = $(".ui-rangeSlider-rightHandle").offset().left;
		this.minLabelPos = $(".ui-rangeSlider-leftLabel").offset().left;
		this.maxLabelPos = $(".ui-rangeSlider-rightLabel").offset().left;
	}
	
	this.getValues = function(){
		this.values = $("#test")[this.type]("values");
	}
	
	this.assertDifferentPositions = function(){
		notEqual($(".ui-rangeSlider-leftHandle").offset().left, this.minHandlerPos, "Left handle should have been moved");
		notEqual($(".ui-rangeSlider-rightHandle").offset().left, this.maxHandlerPos, "Right handle should have been moved");
		notEqual($(".ui-rangeSlider-leftLabel").offset().left, this.minLabelPos, "Left label should have been moved");
		notEqual($(".ui-rangeSlider-rightLabel").offset().left, this.maxLabelPos, "Right label should have been moved");
	}
	
	this.min = function(){
		return el[this.type]("values").min;
	}
	
	this.max = function(){
		return el[this.type]("values").max;
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
			var testCase = this.tests[this.index],
				success = true;

			if (testCase.setup){
				success = this.launchSetup(testCase);
			}

			if (success){
				setTimeout($.proxy(this.check, this), testCase.delay);
			}else{
				this.index++;
				this.next();
			}
		}
	}

	this.launchSetup = function(testCase){
		try{
			testCase.setup();
		}catch(e){
			module(testCase.module);
			test(testCase.name, function(){
				ok(false, e.message);
			});

			return false;
		}

		return true;
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