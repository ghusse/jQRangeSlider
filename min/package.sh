#!/bin/bash
SRCDIR=..
LIBS=${SRCDIR}/lib
OUTPUT=..

DIR=${OUTPUT}/jQRangeSlider-min

# Compile
./compile.sh

# Remove the directory if present
rm -rf ${DIR}

# Create directory and copy stuff
mkdir ${DIR}
mv ${SRCDIR}/jQRangeSlider-min.js ${DIR}
mv ${SRCDIR}/jQAllRangeSliders-min.js ${DIR}
cp -R ${SRCDIR}/css ${DIR}
cp -R ${SRCDIR}/demo ${DIR}
cp ${SRCDIR}/GPL-License.txt ${DIR}
cp ${SRCDIR}/MIT-License.txt ${DIR}
cp ${SRCDIR}/Readme.md ${DIR}

# Copy libs
DIRLIB=${DIR}/lib
mkdir ${DIRLIB}
cp ${LIBS}/jquery-1.4.4.min.js ${DIRLIB}
cp ${LIBS}/jquery.mousewheel.min.js ${DIRLIB}

# Replace jQRangeSlider by the minified version in demo
sed -i \.tmp 's/<!-- Debug -->/<!-- Debug --><!--/g' ${DIR}/demo/index.html
sed -i \.tmp 's/<!-- \/Debug -->/--><!-- Debug -->/g' ${DIR}/demo/index.html

sed -i \.tmp 's/<!-- Minified --><!--/ /g' ${DIR}/demo/index.html
sed -i \.tmp 's/--><!-- \/Minified -->/ /g' ${DIR}/demo/index.html

rm ${DIR}/demo/*.tmp

# Compress
zip -r -q -9 ${DIR} ${DIR}

# flush
rm -Rf ${DIR}