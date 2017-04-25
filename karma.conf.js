// Karma configuration
// Generated on Fri Jun 24 2016 14:18:54 GMT-0600 (Mountain Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
	
	 'js/vendor/jquery-1.10.2.min.js',
	 'js/jquery-ui.js?ver=1.10.3',
	 'js/wp-embed.min.js?ver=4.4.2',
	 'js/jquery/jquery.js?ver=1.11.3',
	 'js/jquery/jquery-migrate.min.js?ver=1.2.1',
	 'http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js',
	 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js',
	 'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.3.1/angular-ui-router.js',
	 'http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-cookies.js',
	 'https://cdn.rawgit.com/zenorocha/clipboard.js/master/dist/clipboard.min.js',
	 'node_modules/**/*.js',
      'js/**/*.js',
      'tests/**/*.js',
     
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
		
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
