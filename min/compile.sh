#!/bin/bash
MINDIR=../
COMPILER=../lib/compiler/compiler.jar
SRCDIR=../
OPTIONS="--compilation_level ADVANCED_OPTIMIZATIONS"

BASE=${SRCDIR}jQRangeSlider.js
BASEMIN=${MINDIR}jQRangeSlider-min.js
DATE=${SRCDIR}jQDateRangeSlider.js
ALLMIN=${MINDIR}jQAllRangeSliders-min.js

if [ ! -d "${MINDIR}" ]; then
	mkdir ${MINDIR}
fi

echo Compile jQRangeSlider
java -jar ${COMPILER} --js=${BASE} --js_output_file=${BASEMIN} ${OPTIONS}

#file sizes
BaseSize=$(ls -la "$BASE" | awk '{ print $5}')
BaseMinSize=$(ls -la "$BASEMIN" | awk '{ print $5}')
echo jQRangeSlider size: ${BaseSize}
echo Minified version: ${BaseMinSize}
let "compression=100 * (${BaseSize} - ${BaseMinSize})  / ${BaseSize}"
echo Ratio: ${compression}%

echo -----

echo Compile jQRangeSlider and jQDateRangeSlider
java -jar ${COMPILER} --js=${BASE} --js=${DATE} --js_output_file=${ALLMIN} ${OPTIONS}

#file sizes
DateSize=$(ls -la "$DATE" | awk '{ print $5}')
AllMinSize=$(ls -la "$ALLMIN" | awk '{ print $5}')
let "CombinedSize=${BaseSize} + ${DateSize}"

echo Combined size: ${CombinedSize}
echo Minified version: ${AllMinSize}
let "compressionAll=100 * (${CombinedSize}- ${AllMinSize})  / (${CombinedSize})"
echo Ratio: ${compressionAll}%