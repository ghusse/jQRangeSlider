/* jQRangeSlider
 * A javascript slider selector that supports dates
 * 
 * Copyright (C) Guillaume Gautreau 2010
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
 //jshint latedef: nofunc
(function(){
	"use strict";

	function equal(actual, expected, epsilon){
		if (typeof actual !== typeof expected){
			return false;
		}

		if (isNaN(actual)){
			return isNaN(expected);
		}

		return Math.abs(expected - actual) < epsilon;
	}

	function equiv (actual, expected, epsilon){
		if (typeof actual !== typeof expected){
			return false;
		}

		if (typeof expected === "number"){
			return equal(actual, expected, epsilon);
		} else if (typeof expected === "object"){
			return equivObject(actual, expected, epsilon);
		} else {
			return actual === expected;
		}
	}

	function equivObject(actual, expected, epsilon){
		for(var name in expected){
			if (expected.hasOwnProperty(name) && !equiv(actual[name], expected[name], epsilon)){
				return false;
			}
		}

		for(name in actual){
			if (actual.hasOwnProperty(name) &&!equiv(actual[name], expected[name], epsilon)){
				return false;
			}
		}

		return true;
	}

	QUnit.equalEpsilon = function(actual, expected, epsilon, message){
		QUnit.push(equal(actual, expected, epsilon), actual, expected, message );
	}

	QUnit.deepEqualEpsilon = function(actual, expected, epsilon, message){
		QUnit.push(equiv(actual, expected, epsilon), actual, expected, message);
	}

}());

