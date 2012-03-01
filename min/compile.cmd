@echo off

set MINDIR=../
set COMPILER=../lib/compiler/compiler.jar
set SRCDIR=../
set OPTIONS=--warning_level VERBOSE

set BASE=%SRCDIR%jQRangeSlider.js
set DATE=%SRCDIR%jQDateRangeSlider.js
set EDIT=%SRCDIR%jQEditRangeSlider.js
set BASEMIN=%MINDIR%jQRangeSlider-min.js
set DATEMIN=%MINDIR%jQDateRangeSlider-min.js
set EDITMIN=%MINDIR%jQEditRangeSlider-min.js
set ALLMIN=%MINDIR%jQAllRangeSliders-min.js

rem Create the directory if it does not exist
IF NOT EXIST %MINDIR% MKDIR %MINDIR%

@echo Compiling jQRangeSlider
java -jar %COMPILER% --js=%BASE% --js_output_file=%BASEMIN% %OPTIONS%

@echo ----

@echo Compiling jQDateRangeSlider
java -jar %COMPILER% --js=%DATE% --js_output_file=%DATEMIN% %OPTIONS%

@echo ----

@echo Compiling jQEditRangeSlider
java -jar %COMPILER% --js=%EDIT% --js_output_file=%EDITMIN% %OPTIONS%

@echo ----

@echo Compiling jQRangeSlider, jQDateRangeSlider and jQEditRangeSlider
java -jar %COMPILER% --js=%BASE% --js=%DATE% --js=%EDIT% --js_output_file=%ALLMIN%  %OPTIONS%
