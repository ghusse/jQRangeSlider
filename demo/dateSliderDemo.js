

(function($, undefined){
	"use strict";

	$.widget("ui.dateSliderDemo", $.ui.sliderDemo, {
		options: {},
		_title: "Date values",
		_name: "dateRangeSlider",

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
		},

		_fillMinSelect: function(select){
			this._addOption(select, "Deactivated", "");
			this._addOption(select, "4 weeks", this._weeksToTime(4));
			this._addOption(select, "8 weeks", this._weeksToTime(8));
			this._addOption(select, "16 weeks", this._weeksToTime(16));
		},

		_daysToTime: function(days){
			return days  * 3.6e6 * 24;
		},

		_weeksToTime: function(weeks){
			return this._daysToTime(weeks * 7);
		},

		_fillMaxSelect: function(select){
			this._addOption(select, "Deactivated", "");
			this._addOption(select, "365 days", this._daysToTime(365));
			this._addOption(select, "400 days", this._daysToTime(400));
			this._addOption(select, "500 days", this._daysToTime(500));
		}

	});

})(jQuery);