#!/bin/bash
SRCDIR=..
LIBS=${SRCDIR}/lib
OUTPUT=..

# Ask for version number
if [ -z "$1" ]; then
	echo Version number:
	read VERSION
else
	VERSION=$1
fi

FILE=jQRangeSlider-${VERSION}-min
DIR=${OUTPUT}/${FILE}

# Compile
./compile.sh ${VERSION}

# Remove the directory if present
rm -rf ${DIR}

# Create directory and copy stuff
mkdir ${DIR}
mv ${SRCDIR}/jQRangeSlider-min.js ${DIR}
mv ${SRCDIR}/jQDateRangeSlider-min.js ${DIR}
mv ${SRCDIR}/jQEditRangeSlider-min.js ${DIR}
mv ${SRCDIR}/jQAllRangeSliders-min.js ${DIR}
cp -R ${SRCDIR}/css ${DIR}
cp -R ${SRCDIR}/demo ${DIR}
cp ${SRCDIR}/GPL-License.txt ${DIR}
cp ${SRCDIR}/MIT-License.txt ${DIR}
cp ${SRCDIR}/Readme.md ${DIR}
cp ${SRCDIR}/History.md ${DIR}

# Copy libs
DIRLIB=${DIR}/lib
mkdir ${DIRLIB}
cp ${LIBS}/jquery-1.7.1.min.js ${DIRLIB}
cp ${LIBS}/jquery.mousewheel.min.js ${DIRLIB}

# Replace jQRangeSlider by the minified version in demo
sed -i "" 's/<!-- Debug -->/<!-- Debug --><!--/g' ${DIR}/demo/index.html
sed -i "" 's/<!-- \/Debug -->/--><!-- Debug -->/g' ${DIR}/demo/index.html

sed -i "" 's/<!-- Minified --><!--/ /g' ${DIR}/demo/index.html
sed -i "" 's/--><!-- \/Minified -->/ /g' ${DIR}/demo/index.html

# Compress
zip -r -q -9 ${DIR}.zip ${DIR}

# flush
rm -Rf ${DIR}

