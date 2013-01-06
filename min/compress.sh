#!/bin/bash
COMPILER=../lib/compiler/compiler.jar
OPTIONS="--language_in ECMASCRIPT5_STRICT"

BASEMIN=$2
VERSION=$3
JS=""
BASESIZE=0

for ((i=4; i <= $#; i++))
do
	File=${!i}
	JS=${JS}"--js=${File} "
done

echo Compile $1
java -jar ${COMPILER} ${JS} --js_output_file=${BASEMIN} ${OPTIONS}

echo -e '0r header.js\nw' | ed -s ${BASEMIN}
sed -i "" "s/\\\$version/${VERSION}/" ${BASEMIN}