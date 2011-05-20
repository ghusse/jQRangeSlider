@echo off

set MINDIR=../
set COMPILER=../lib/compiler/compiler.jar
set SRCDIR=../
set OPTIONS=--compilation_level ADVANCED_OPTIMIZATIONS

set BASE=%SRCDIR%jQRangeSlider.js
set DATE=%SRCDIR%jQDateRangeSlider.js
set BASEMIN=%MINDIR%jQRangeSlider-min.js
set ALLMIN=%MINDIR%jQAllRangeSliders-min.js

rem Create the directory if it does not exist
IF NOT EXIST %MINDIR% MKDIR %MINDIR%

@echo Compiling jQRangeSlider
java -jar %COMPILER% --js=%BASE% --js_output_file=%BASEMIN% %OPTIONS%

rem file sizes
for %%I in (%BASE%) do @echo jQRangeSlider size: %%~zI
for %%I in (%BASEMIN%) do @echo Minified size: %%~zI

@echo ----

@echo Compiling jQRangeSlider and jQDateRangeSlider
java -jar %COMPILER% --js=%BASE% --js=%DATE% --js_output_file=%ALLMIN%  %OPTIONS%

rem file sizes
for %%I in (%BASE%) do @echo jQRangeSlider size: %%~zI
for %%I in (%DATE%) do @echo jQDateRangeSlider size: %%~zI
for %%I in (%ALLMIN%) do @echo Minified size: %%~zI
