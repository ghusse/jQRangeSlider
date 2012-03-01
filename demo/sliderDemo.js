
(function($, undefined){
	"use strict";

	$.widget("ui.sliderDemo", {
		options:{
		},

		_title: "Float values",
		_name: "rangeSlider",

		_create: function(){
			this.element.addClass("ui-sliderDemo");

			this._elements = {};
			this._createTitle();
			this._createZones();
			this._createInputs();
			this._createOptions();
			this._createSlider();
			this._createCode();
		},

		destroy: function(){
			this.element.empty();
		},

		_setOption: function(name, value){
			this._elements.slider[this._name]("option", name, value);
		},

		_easyOptionChange: function(e){
			var target = $(e.target),
				value = target.val(),
				name = target.attr("name");

			if (value === "false"){
				value = false
			} else if (value === "null"){
				value = null
			} else if (!isNaN(parseFloat(value)) && parseFloat(value).toString() == value){
				value = parseFloat(value)
			}

			this._setOption(name, value);
		},

		_createZones: function(){
			var wrapper = $("<div class='wrapper' />").appendTo(this.element),
			inputZone = $("<div class='sliderZone' />").appendTo(wrapper),
				optionsZone = $("<div class='options' />").appendTo(this.element);

			this._elements.sliderZone = $("<form onsubmit='return false' />").appendTo(inputZone);
			this._elements.optionsZone = $("<form onsubmit='return false' />").appendTo(optionsZone);
		},

		_createTitle: function(){
			var title = $("<h2 />");
			title.text(this._title);

			this.element.append(title);
		},

		_createInputs: function(){
			var inputs = $("<dl />"),
				minInputContainer = $("<dd />"),
				maxInputContainer = $("<dd />");

			this._elements.minInput = $("<input type='text' name='min' />").appendTo(minInputContainer);
			this._elements.maxInput = $("<input type='text' name='max' />").appendTo(maxInputContainer);

			inputs.append("<dt>min</dt>")
				.append(minInputContainer)
				.append("<dt>max</dt>")
				.append(maxInputContainer)
				.appendTo(this._elements.sliderZone);
		},

		_createSlider: function(){
			var slider = $("<div />").appendTo(this._elements.sliderZone);
			slider[this._name]();

			slider.bind("valuesChanging", $.proxy(this._displayValues, this));

			this._elements.slider = slider;
		},

		_displayValues: function(e){
			var values = this._elements.slider[this._name]("values");

			this._elements.minInput.val(this._format(values.min));
			this._elements.maxInput.val(this._format(values.max));
		},

		_format: function(value){
			return value;
		},

		_createOptions: function(){
			this._elements.options = $("<dl />").appendTo(this._elements.optionsZone);

			this._createRangeOptions();
			this._createWheelModeOption();
			this._createWheelSpeedOption();
			this._createArrowsOption();
			this._createLabelsOption();
			this._createBindingOption();
		},

		_createRangeOptions: function(){
			this._createDT("Range limit");

			var minSelect = this._createSelect("min"),
			maxSelect = this._createSelect("max");

			this._fillMinSelect(minSelect);
			this._fillMaxSelect(maxSelect);

			minSelect.bind("change", $.proxy(this._minSelectChange, this));
			maxSelect.bind("change", $.proxy(this._maxSelectChange, this));
		},

		_createDT: function(text){
			var dt = $("<dt />");
			dt.text(text);

			this._elements.options.append(dt);
		},

		_createSelect: function(name){
			var select = $("<select />").attr("name", name + "RangeLimit");

			this._elements.options.append($("<dd />")
				.append(name + ":")
				.append(select));

			return select;
		},

		_fillMinSelect: function(select){
			this._addOption(select, "Deactivated", "");
			this._addOption(select, 10, 10);
			this._addOption(select, 20, 20);
			this._addOption(select, 30, 30);
			this._addOption(select, 40, 40);
		},

		_fillMaxSelect: function(select){
			this._addOption(select, "Deactivated", "");
			this._addOption(select, 50, 50);
			this._addOption(select, 60, 60);
			this._addOption(select, 70, 70);
			this._addOption(select, 80, 80);
		},

		_addOption: function(select, text, value){
			var option = $("<option />").attr("value", value);
			option.text(text);

			select.append(option);

			return option;
		},

		_minSelectChange: function(e){
			var value = $(e.target).val();
			this._setRangeOption(value, "min");
		},

		_maxSelectChange: function(e){
			var value = $(e.target).val();
			this._setRangeOption(value, "max");
		},

		_setRangeOption: function(value, optionName){
			var option = {};

			if (value == ""){
				option[optionName] = false;
			}else{
				option[optionName] = parseFloat(value);
			}

			this._setOption("range", option);
		},

		_createWheelModeOption: function(){
			this._createDT("Wheel mode");

			var select = $("<select name='wheelMode' />");
			
			this._createDD(select);

			this._addOption(select, "null", "null");
			this._addOption(select, "scroll", "scroll");
			this._addOption(select, "zoom", "zoom");

			select.change($.proxy(this._easyOptionChange, this));	
		},

		_createDD: function(element){
			$("<dd />").append(element).appendTo(this._elements.options);
		},

		_createWheelSpeedOption: function(){
			this._createDT("Wheel speed");

			var input = $("<input type='number' name='wheelSpeed' value='4' />");
			this._createDD(input);

			input.on("click keyup", $.proxy(this._easyOptionChange, this));
		},

		_createArrowsOption: function(){
			this._createDT("Arrows");

			var label = $("<label>Activate arrows</label>"),
				input = $("<input type='checkbox' name='arrows' checked='checked' />").prependTo(label);

			this._createDD(label);

			input.click($.proxy(this._activateArrows, this));
		},

		_activateArrows: function(e){
			var checked = $(e.target).is(":checked");

			this._setOption("arrows", checked);
		},

		_createLabelsOption: function(){
			this._createDT("Value labels");

			var select = $("<select name='valueLabels' />");

			this._addOption(select, "show", "show");
			this._addOption(select, "hide", "hide");
			this._addOption(select, "on change", "change");

			this._createDD(select);

			select.change($.proxy(this._easyOptionChange, this));
		},

		_createBindingOption: function(){
			this._createDT("Binding");

			var changing = $("<input value='valuesChanging' name='binding' class='binding' type='radio' checked='checked' />"),
				changed = $("<input value='valuesChanged' name='binding' class='binding' type='radio' />");

			this._createDD($("<label>valuesChanging</label>").prepend(changing));
			this._createDD($("<label>valuesChanged</label>").prepend(changed));

			changing.click($.proxy(this._changeBinding, this));
			changed.click($.proxy(this._changeBinding, this));
		},

		_changeBinding: function(e){
			var checked = $(e.target).parents("form").find(".binding:checked");

			this._elements.slider
				.unbind("valuesChanging")
				.unbind("valuesChanged")
				.bind(checked.val(), $.proxy(this._displayValues, this));
		},

		_createCode: function(){
			this.element.append("<h3>Code</h3>");
			var pre = $("<pre />").appendTo(this.element),
				container = $("<code />").appendTo(pre);

			this._fillCode(container);
		},

		_fillCode: function(container){
			this._addComment(container, "Default constructor");
			this._addLine(container, '$("#element").'+ this._name +'();');
		},

		_addComment: function(container, text){
			var span = $("<span class='comment'></span>");

			span.text("// " + text);
			this._addLine(container, span);
		},

		_addLine: function(container){
			for (var i=1; i<arguments.length; i++){
				container.append($("<div class='line'/>").append(arguments[i]));
			}
		},

		_addBlankLine: function(container){
			container.append("<br />");
		}

	});

})(jQuery);