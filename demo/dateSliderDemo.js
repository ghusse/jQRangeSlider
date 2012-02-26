

(function($, undefined){

	$.widget("ui.dateSliderDemo", $.ui.sliderDemo, {
		options: {},

		_create: function(){
			this._title = "Date values";

			$.ui.sliderDemo.prototype._create.apply(this, []);
		},

		_createSlider: function(){
			this._name = "dateRangeSlider";

			$.ui.sliderDemo.prototype._createSlider.apply(this, []);
		},

		_createInputs: function(){
			$.ui.sliderDemo.prototype._createInputs.apply(this, []);

			this._addPicker(this._elements.minInput);
			this._addPicker(this._elements.maxInput);

			(function(that){
				that._elements.minInput.change(function(){
					that._valueChanged($(this).datepicker("getDate"), "min");
				});

				that._elements.maxInput.change(function(){
					that._valueChanged($(this).datepicker("getDate"), "max");
				});
			})(this);
			
			this._elements.minInput.change($.proxy(this._minChanged, this));
		},

		_valueChanged: function(value, name){
			this._elements.slider[this._name](name, value);
		},

		_addPicker: function(input){
			input.datepicker({
				maxDate: new Date(2012,0,1),
				minDate: new Date(2010,0,1),
				dateFormat: "yy-mm-dd",
				buttonImage: "img/calendar.png",
				buttonImageOnly: true,
				buttonText: "Choose a date",
				showOn: "both"
				});
		},

		_format: function(value){
			return $.datepicker.formatDate("yy-mm-dd", value);
		}

	});

})(jQuery);