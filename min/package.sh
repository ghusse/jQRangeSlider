#!/bin/bash
MINDIR=../
OUTDIR=../jQRangeSlider-min
SRCDIR=../

echo "Package version:"
read VERSION
./compile.sh

if [ ! -d "${OUTDIR}" ]; then
	mkdir "${OUTDIR}"
fi

mv "${MINDIR}jQRangeSlider-min.js" "${OUTDIR}"
mv "${MINDIR}jQAllRangeSliders-min.js" "${OUTDIR}"
cp -R "${SRCDIR}css" "${OUTDIR}"
cp "${SRCDIR}Readme.md" "${OUTDIR}"
cp "${SRCDIR}License.txt" "${OUTDIR}"
cp -R "${SRCDIR}demo" "${OUTDIR}"

zip -r "${MINDIR}jQRangeSlider-${VERSION}-min.zip" "${OUTDIR}"
rm -R "${OUTDIR}"