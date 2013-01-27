
test:
	jshint *.js --config .jshintconfig
	jshint tests/unit/*.js --config tests/.jshintconfig
	node tests/server.js &
	phantomjs tests/phantom.js "http://localhost:3000/tests"
	kill -9 `cat tests/pid.txt`
	rm tests/pid.txt