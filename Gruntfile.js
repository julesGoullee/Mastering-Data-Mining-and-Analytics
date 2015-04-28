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
                        src: "bower_components/jquery/dist/jquery.min.js",
                        dest: "public/external/jquery.js"
                    },
                    {
                        src: "bower_components/jquery/dist/jquery.min.map",
                        dest: "public/external/jquery.min.map"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf",
                        dest: "public/fonts/glyphicons-halflings-regular.ttf"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff",
                        dest: "public/fonts/glyphicons-halflings-regular.woff"
                    }

                ]
            },
            bowerDev:{
                files : [
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap.css",
                        dest: "public/external/bootstrap.css"
                    },
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap.css.map",
                        dest: "public/external/bootstrap.css.map"
                    },
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap-theme.css.map",
                        dest: "public/external/bootstrap-theme.css.map"
                    },
                    {
                        src: "bower_components/bootstrap/dist/css/bootstrap-theme.css",
                        dest: "public/external/bootstrap-theme.css"
                    },
                    {
                        src: "bower_components/bootstrap/dist/js/bootstrap.js",
                        dest: "public/external/bootstrap.js"
                    },
                    {
                        src: "bower_components/jquery/dist/jquery.js",
                        dest: "public/external/jquery.js"
                    },
                    {
                        src: "bower_components/jquery/dist/jquery.min.map",
                        dest: "public/external/jquery.min.map"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf",
                        dest: "public/fonts/glyphicons-halflings-regular.ttf"
                    },
                    {
                        src: "bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff",
                        dest: "public/fonts/glyphicons-halflings-regular.woff"
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


