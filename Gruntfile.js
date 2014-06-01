var FILE_ENCODING = "utf-8";

var fs = require("fs");

var coreFiles = ["jQRangeSliderMouseTouch.js",
  "jQRangeSliderDraggable.js",
  "jQRangeSlider.js",
  "jQRangeSliderHandle.js",
  "jQRangeSliderBar.js",
  "jQRangeSliderLabel.js"];

var rulerFiles = ["jQRuler.js"];

var dateFiles = [
    "jQDateRangeSlider.js",
    "jQDateRangeSliderHandle.js"];

var editFiles = [
    "jQEditRangeSlider.js",
    "jQEditRangeSliderLabel.js"
  ];

var info = JSON.parse(fs.readFileSync("jQRangeSlider.jquery.json")),
  jshintConfig = JSON.parse(fs.readFileSync(".jshintconfig")),
  jshintConfigTests = JSON.parse(fs.readFileSync("tests/.jshintconfig"));

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('jQRangeSlider.jquery.json'),
    clean: {
      filesSrc: ["dest/"]
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> - ' +
          'Copyright (C) Guillaume Gautreau 2012 - '+
          'MIT and GPLv3 licenses.*/'
      },
      basic: {
        files: {
          'dest/jQRangeSlider-min.js': coreFiles
        }
      },
      basicRuler: {
        files: {
          'dest/jQRangeSlider-withRuler-min.js': coreFiles.concat(rulerFiles)
        }
      },
      date: {
        files: {
          'dest/jQDateRangeSlider-min.js': coreFiles.concat(dateFiles)
        }
      },
      dateRuler: {
        files: {
          'dest/jQDateRangeSlider-withRuler-min.js': coreFiles.concat(dateFiles).concat(rulerFiles)
        }
      },
      edit: {
        files: {
          'dest/jQEditRangeSlider-min.js': coreFiles.concat(editFiles)
        }
      },
      editRuler: {
        files: {
          'dest/jQEditRangeSlider-withRuler-min.js': coreFiles.concat(editFiles).concat(rulerFiles)
        }
      },
      all: {
        files: {
          'dest/jQAllRangeSliders-min.js': coreFiles.concat(dateFiles).concat(editFiles)
        }
      },
      allRuler: {
        files: {
          'dest/jQAllRangeSliders-withRuler-min.js': coreFiles.concat(dateFiles).concat(editFiles).concat(rulerFiles)
        }
      }
    },
    copy: {
      demo: {
        files: [
          {src: ["demo/**"], dest: "dest/"}
        ]
      },
      css: {
        files: [
          {src: ["css/**"], dest: "dest/"}
        ]
      },
      lib:{
        files: [
          {src: ["jquery.mousewheel*"], dest: "dest/lib/", expand: true, cwd: 'lib/'}
        ]
      },
      doc: {
        files: [
          {src: ["*.md", "MIT-License.txt", "GPL-License.txt"], dest: "dest/"}
        ]
      }
    },
    cssmin: {
      compress: {
        files: {
          "dest/css/iThing-min.css": ["css/iThing.css"],
          "dest/css/classic-min.css": ["css/classic.css"]
        }
      }
    },
    compress:{
      package:{
        options:{
          archive: "packages/jQRangeSlider-" + info.version + ".zip",
          level: 9
        },
        files: [
          {src: ["**"], dest: "jQRangeSlider-" + info.version, expand: true, cwd: 'dest/'}
        ]
      }
    },
    jshint:{
      options: jshintConfig,
      use_defaults: ["jQ*.js"],
      with_overrides: {
        options: jshintConfigTests,
        files: {src: ["tests/unit/*"]}
      }
    },
    qunit: {
      all: {
        options: {
          urls: ['http://localhost:8000/tests/index.html']
        }
      }
    },
    connect:{
      server:{
        options:{
          port: 8000,
          base: "."
        }
      }
    }
  });

  // loading the required tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.registerTask("modifyDemo", "Modify demo.", function(){
    var file="dest/demo/index.html",
      content = fs.readFileSync(file, FILE_ENCODING);

    content = content.replace(/<\!-- *Debug[\s\S]*\/Debug *-->/gi, "");
    content = content.replace(/<\!-- *Minified --><\!--/gi, "");
    content = content.replace(/--><\!-- *\/Minified *-->/gi, "");

    fs.writeFileSync(file, content, FILE_ENCODING);
    grunt.log.writeln('Demo modified');
  });

  grunt.event.on('qunit.spawn', function (url) {
    grunt.log.ok("Running test: " + url);
  });

  grunt.registerTask("default", ["clean", "uglify", "copy", "modifyDemo", "cssmin", "compress"]);
  grunt.registerTask('test', ['connect', 'qunit']);
  grunt.registerTask('ci', ["jshint", "test"]);
};
