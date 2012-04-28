#!/bin/bash
MINDIR=../
SRCDIR=../

TOUCH=${SRCDIR}jQRangeSliderMouseTouch.js
DRAGGABLE=${SRCDIR}jQRangeSliderDraggable.js
HANDLE=${SRCDIR}jQRangeSliderHandle.js
DATEHANDLE=${SRCDIR}jQDateRangeSliderHandle.js
BAR=${SRCDIR}jQRangeSliderBar.js
LABEL=${SRCDIR}jQRangeSliderLabel.js

CORE="${BASEMIN}" "${MOUSETOUCH}" "${DRAGGABLE}" "${BAR}" "${LABEL}" "${HANDLE}" "${BASE}"

BASE=${SRCDIR}jQRangeSlider.js
BASEMIN=${MINDIR}jQRangeSlider-min.js
DATE=${SRCDIR}jQDateRangeSlider.js
DATEMIN=${SRCDIR}jQDateRangeSlider-min.js
EDIT=${SRCDIR}jQEditRangeSlider.js
EDITMIN=${SRCDIR}jQEditRangeSlider-min.js
ALLMIN=${MINDIR}jQAllRangeSliders-min.js

if [ ! -d "${MINDIR}" ]; then
	mkdir ${MINDIR}
fi

./compress.sh jQRangeSlider ${CORE}

echo -----

./compress.sh jQDateRangeSlider ${CORE} "${DATEHANDLE}" "${DATE}"

#echo -----

#./compress.sh jQEditRangeSlider "${EDITMIN}" "${EDIT}"

#echo -----

#./compress.sh jQAllRangeSliders "${ALLMIN}" "${BASE}" "${DATE}" "${EDIT}"