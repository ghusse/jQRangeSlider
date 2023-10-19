jQRangeSlider, jQDateRangeSlider & jQEditRangeSlider [![Build Status](https://travis-ci.org/ghusse/jQRangeSlider.svg?branch=master)](https://travis-ci.org/ghusse/jQRangeSlider)
====================================================
A javascript slider selector that supports dates and touch devices

* [Home page](https://ghusse.github.io/jQRangeSlider/)
* [Documentation](https://ghusse.github.io/jQRangeSlider/documentation.html)
* [Github](https://github.io/ghusse/jQRangeSlider/)

License
-------
Copyright : Guillaume Gautreau 2010
License : Dual license GPL v3 and MIT

Dependencies
------------
+ jQuery
+ jQuery UI core
+ jQuery UI widget
+ jQuery UI mouse
+ jQuery Mousewheel plugin by Brandon Aaron (optional, needed for scrolling or zooming)


Generating minified jQRangeSlider files
---------------------------------------

You need nodejs and npm. Open a command line interface and run:

     npm install
     npm install -g grunt-cli

Now you can minify jQRangeSlider and build a zip package by running

     grunt

You can launch jshint and unit tests too:

     grunt ci

