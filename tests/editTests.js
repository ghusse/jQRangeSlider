/* jQRangeSlider
 * A javascript slider selector that supports dates
 * 
 * Copyright (C) Guillaume Gautreau 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
 

(function(){
	var editSetup = new TestCase(
		'Setup for EditSlider',
		function(){
			el.empty();
		},
		null);

	var ctorTest = new TestCase(
		"Default ctor test",
		function(){
			el.editRangeSlider();
		},
		function(){
			ok(el.hasClass("ui-editRangeSlider"), "ui-editRangeSlider class should have been added " + el.attr("class"));

			var inputs = el.find(".ui-rangeSlider-label input.ui-editRangeSlider-inputValue");

			equal(inputs.length, 2, "Input should have been created");
			equal(inputs.attr("type"), "text", "Default type is text");
		}
	);

	var destroyTest = new TestCase(
		"Destroy test",
		function(){
			el.editRangeSlider("destroy");
		},
		function(){
			equal(el.attr("class"), "", "Class should be empty after destroy");
		}
	);

	var destroy = new TestCase(
		"Destroy",
		function(){
			el.editRangeSlider("destroy");
		},
		null);

	function testDisplayedValues(min, max){
		var inputs = el.find("input"),
				first = $(inputs[0]),
				second = $(inputs[1]);

			ok(first.val() === min.toString() || first.val() === max.toString(), "Displayed value should be rounded");
			ok(second.val() === min.toString() || second.val() === max.toString(), "Displayed value should be rounded");
			ok(first.val() != second.val(), "Values should be different");
	}

	var typeCtor = new TestCase(
		"Ctor specifying input type",
		function(){
			el.editRangeSlider({
				type: "number"
			});
		},
		function(){
			equal(el.find("input").attr("type"), "number", "Input type should have been modified");
		}
	);

	var setType = new TestCase(
		"Input type setter",
		function(){},
		function(){
			testInputType("text");
			testInputType("number");
		}
	);

	function testInputType(type){
		el.editRangeSlider("option", "type", type);
		equal(el.editRangeSlider("option", "type"), type, "Type option should have been set");
		equal(el.find("input").attr("type"), type, "Type should be used by inputs");
	}

	var setInvalidType = new TestCase(
		"Invalid input type",
		function(){
			el.editRangeSlider("option", "type", "date");
		},
		function(){
			ok(el.editRangeSlider("option", "type") != "date", "Invalid input type should not be set");
			ok(el.find("input").attr("type") != "date", "Invalid input type");
		}
	);

	var enterKeyBindingTest = new TestCase(
		"Value change on enter",
		function(){
			el.editRangeSlider("values", 11, 55);

			var input = $(el.find("input")[0]);

			input.val("40")
				.simulate("keyup", {which: 13});
			this.type = "editRangeSlider";
		},
		function(){
			ok(this.min() == 40 || this.max() == 40, "Entered value should have been set");
		}
	);

	var clickBindingTest = new TestCase(
		"Value change on click",
		function(){
			el.editRangeSlider("option", "type", "number");
			el.editRangeSlider("values", 11, 55);

			var input = $(el.find("input")[0]);
			input.val("40").focus().click();
			this.type = "editRangeSlider";
		},

		function(){
			ok(this.min() == 40 || this.max() == 40, "Value should have been set " + this.min() + " " + this.max());
		}
	);

	var clickBindingWithoutFocusTest = new TestCase(
		"Click on number input without focus",
		function(){
			el.editRangeSlider("option", "type", "number");
			el.editRangeSlider("values", 11, 55);
			var input = $(el.find("input")[0]);
			
			input.blur().val("40").click();
			this.type = "editRangeSlider";
		},
		function(){
			ok(this.min() != 40 || this.max() != 40, "Value should not have been set")
		}
	);

	var blurBinding = new TestCase(
		"Change values on blur",
		function(){
			el.editRangeSlider("values", 11, 55);

			var input = $(el.find("input")[0]);
			input.focus().val("40").blur();
			this.type = "editRangeSlider";
		},
		function(){
			ok(this.min() == 40 || this.max() == 40, "Value should have been set")
		}
	);
	
	var nameBasedOnId = new TestCase(
		"#27 name based on id",
		function(){
		},
		function(){ 
			equal(el.find(".ui-rangeSlider-leftLabel input").attr("name"), "testleft");
			equal(el.find(".ui-rangeSlider-rightLabel input").attr("name"), "testright");
		}
	);

	var stepNumberCtor = new TestCase(
		"Step option on ctor, with number inputs",
		function(){
			el.editRangeSlider({
				step: 5,
				type: "number"
			});
		},
		function(){
			var input = el.find("input");

			equal(2, input.length, "Should have found 2 inputs");
			equal("number", input.attr("type"), "Should be number input");
			equal("5", input.attr("step"), "Step should be propagated to inputs");
		}
	);

	var stepNumberSetter = new TestCase(
		"Step option with number inputs",
		function(){
			el.editRangeSlider({
				step: 10,
				type: "number"
			});
		},
		function(){
			var input = el.find("input");

			equal(input.length, 2, "Should have found 2 inputs");
			equal("number", input.attr("type"), "Should be number input");
			equal(input.attr("step"), '10', "Step should be propagated to inputs");

			el.editRangeSlider("option", "step", false);
			input = el.find("input");
			equal(input.attr("step"), "any", "Step should be propagated to inputs");
		}
	);


	testRunner.add("jQEditRangeSlider", [
		editSetup,
		ctorTest,
		destroy,
		
		typeCtor, setType, setInvalidType,
		enterKeyBindingTest, clickBindingTest, clickBindingWithoutFocusTest, blurBinding,
		nameBasedOnId,

		destroy,
		stepNumberCtor, stepNumberSetter,

		destroyTest
	]);
})();