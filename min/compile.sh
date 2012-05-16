#!/bin/bash
MINDIR=../
SRCDIR=../

TOUCH=${SRCDIR}jQRangeSliderMouseTouch.js
DRAGGABLE=${SRCDIR}jQRangeSliderDraggable.js
HANDLE=${SRCDIR}jQRangeSliderHandle.js
DATEHANDLE=${SRCDIR}jQDateRangeSliderHandle.js
BAR=${SRCDIR}jQRangeSliderBar.js
LABEL=${SRCDIR}jQRangeSliderLabel.js

BASE=${SRCDIR}jQRangeSlider.js
BASEMIN=${MINDIR}jQRangeSlider-min.js
DATE=${SRCDIR}jQDateRangeSlider.js
DATEMIN=${SRCDIR}jQDateRangeSlider-min.js
EDIT=${SRCDIR}jQEditRangeSlider.js
EDITLABEL=${SRCDIR}jQEditRangeSliderLabel.js
EDITMIN=${SRCDIR}jQEditRangeSlider-min.js
ALLMIN=${MINDIR}jQAllRangeSliders-min.js

CORE="\"${TOUCH}\" \"${DRAGGABLE}\" \"${BAR}\" \"${LABEL}\" \"${HANDLE}\" \"${BASE}\""
DATECOMPONENTS="\"${DATEHANDLE}\" \"${DATE}\""
EDITCOMPONENTS="\"${EDITLABEL}\" \"${EDIT}\""

if [ ! -d "${MINDIR}" ]; then
	mkdir ${MINDIR}
fi

./compress.sh jQRangeSlider "${BASEMIN}" ${CORE}

echo -----

./compress.sh jQDateRangeSlider "${DATEMIN}" ${CORE} ${DATECOMPONENTS} 

echo -----

./compress.sh jQEditRangeSlider "${EDITMIN}" ${CORE} ${EDITCOMPONENTS} 

echo -----

./compress.sh jQAllRangeSliders "${ALLMIN}" ${CORE} ${DATECOMPONENTS} ${EDITCOMPONENTS}