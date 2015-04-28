"use strict";

module.exports = function(grunt) {

    //grunt.loadNpmTasks("grunt-karma");
    //grunt.loadNpmTasks("grunt-simple-mocha");
    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.initConfig({
        /*simplemocha: {
            all:{
                options: {
                    timeout: 3000,
                    ignoreLeaks: true,
                    reporter: "progress",
                    tdd: "tdd"
                },
                src: "app/server/modules//test/*.js"
            }
        },
        karma: {
            autoRun: {
                basePath: "app/public",
                frameworks: ["jasmine"],
                options:{
                    files: [
                        //external
                        "external/jquery.js",
                        "external/bootstrap.js",
                        //utils
                        "modules/utils/*.js",
                        //MOCK
                        "modules/test/mock.js",
                        //config
                        "modules/config/config.js",
                        //modules
                        "modules//test/.js",
                        "modules//*.js"
                    ]
                },
                // available reporters: https://npmjs.org/browse/keyword/karma-reporter
                reporters: ["dots", "ubuntu"],
                //reporters: ["dots", "growl"],
                autoWatch: true,
                browsers: ["PhantomJS"]
            },
            singleRun: {
                basePath: "app/public",
                frameworks: ["jasmine"],
                options:{
                    files: [
                        //external
                        "external/jquery.js",
                        "external/bootstrap.js",
                        "external/babylonjs/babylon.js",
                        //utils
                        "modules/utils/*.js",
                        //MOCK
                        "modules/test/mock.js",
                        //config
                        "modules/config/config.js",
                        //modules
                        "modules//test/*.js",
                        "modules//*.js"
                    ]
                },
                // available reporters: https://npmjs.org/browse/keyword/karma-reporter
                reporters: ["dots", "ubuntu"],
                //reporters: ["dots", "growl"],
                autoWatch: false,
                singleRun: true,
                browsers: ["PhantomJS"]
            }
        },*/
        copy:{
            bowerProd:{

                files : [
                    //bootstrap
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap.min.css",
                        dest: "public/external/bootstrap.css"
                    },
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap-theme.min.css",
                        dest: "public/external/bootstrap-theme.css"
                    },
                    {
                        src: "bower_components/bootstrap/dist/js/bootstrap.min.js",
                        dest: "public/external/bootstrap.js"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf",
                        dest: "public/fonts/glyphicons-halflings-regular.ttf"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff",
                        dest: "public/fonts/glyphicons-halflings-regular.woff"
                    },
                    //jquery
                    {
                        src: "bower_components/jquery/dist/jquery.min.js",
                        dest: "public/external/jquery.js"
                    },
                    {
                        src: "bower_components/jquery/dist/jquery.min.map",
                        dest: "public/external/jquery.min.map"
                    }

                ]
            },
            bowerDev:{
                files : [
                    //jquery
                    {
                        src: "bower_components/jquery/dist/jquery.js",
                        dest: "public/external/jquery.js"
                    },
                    {
                        src: "bower_components/jquery/dist/jquery.min.map",
                        dest: "public/external/jquery.min.map"
                    },
                    //angularjs
                    {
                        src: "bower_components/angular/angular.js",
                        dest: "public/external/angular.js"
                    },
                    {
                        src: "bower_components/angular/angular.js",
                        dest: "public/external/angular.js"
                    },
                    {
                        src: "bower_components/angular-animate/angular-animate.js",
                        dest: "public/external/angular-animate.js"
                    },
                    {
                        src: "bower_components/angular-aria/angular-aria.js",
                        dest: "public/external/angular-aria.js"
                    },
                    {
                        src: "bower_components/angular-material/angular-material.js",
                        dest: "public/external/angular-material.js"
                    },
                    {
                        src: "bower_components/angular-material/angular-material.css",
                        dest: "public/external/angular-material.css"
                    }
                ]
            }
        },
        bower: {
            install: {
                options: {
                    copy:false
                }
            }
        },
        watch: {
            mochaTest: {
                files: ["app/**/*.js", "Gruntfile.js"],
                options: {
                    reload: true
                },
                tasks: "simplemocha:all"
            }
        }
    });

    grunt.registerTask("default", ["test_all"]);

    //TEST//
    grunt.registerTask("test_server", ["simplemocha:all", "watch:mochaTest"]);
    grunt.registerTask("test_client", ["karma:autoRun"]);

    grunt.registerTask("test_all", ["karma:singleRun","simplemocha:all"]);

    //INSTALLATION
    grunt.registerTask("config_dev", ["bower:install", "copy:bowerDev"]);
    grunt.registerTask("config_prod", ["bower:install", "copy:bowerProd"]);

};


