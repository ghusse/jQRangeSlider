/* jQRangeSlider
 * A javascript slider selector that supports dates
 * 
 * Copyright (C) Guillaume Gautreau 2010
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

var testRunner,
	TestCase;

(function(){
 "use strict";

	QUnit.config.reorder = false;

	TestCase= function(_name, _setup, _check, _tearDown){
		this.name = _name;
		this.setup = _setup;
		this.check = _check;
		this.tearDown = _tearDown;
		this.delay = 100;
		this.type = "rangeSlider";

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
			QUnit.notEqual($(".ui-rangeSlider-leftHandle").offset().left, this.minHandlerPos, "Left handle should have been moved");
			QUnit.notEqual($(".ui-rangeSlider-rightHandle").offset().left, this.maxHandlerPos, "Right handle should have been moved");
			QUnit.notEqual($(".ui-rangeSlider-leftLabel").offset().left, this.minLabelPos, "Left label should have been moved");
			QUnit.notEqual($(".ui-rangeSlider-rightLabel").offset().left, this.maxLabelPos, "Right label should have been moved");
		}
		
		this.min = function(){
			return el[this.type]("values").min;
		}
		
		this.max = function(){
			return el[this.type]("values").max;
		}
	}

	var TestRunner = function(){
		this.module = "";
		this.tests = [];
		this.index = 0;
		
		this.launch = function(){
			for (var i = 0; i< this.tests.length; i++){
				this.launchTest(this.tests[i]);
			}
		}

		this.launchTest = function (test) {
			if (this.module !== test.module){
				QUnit.module(test.module);
				this.module = test.module;
			}

			QUnit.test(test.name, function(){
				try{
					test.setup();
				}catch(e){
					QUnit.ok(false, e.message);
				}
				QUnit.stop();

				setTimeout(function(){
					if (test.check) test.check();
					if (test.tearDown) test.tearDown();
					QUnit.ok(true, "Passed");
					QUnit.start();
				}, test.delay);
			});
		}
		
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

	testRunner = new TestRunner();
}());