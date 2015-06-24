"use strict";

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        karma: {
            unit: {
                configFile: 'public/test/karma.conf.js',
                singleRun: false,
                autoWatch: true
            },
            singleRun:{
                configFile: 'public/test/karma.conf.js',
                singleRun: true,
                autoWatch: false
            }
        },
        copy:{
            bowerProd:{

                files : [
                    //jquery
                    {
                        src: "bower_components/jquery/dist/jquery.min.js",
                        dest: "public/external/jquery.js"
                    },
                    {
                        src: "bower_components/jquery/dist/jquery.min.map",
                        dest: "public/external/jquery.min.js.map"
                    },
                    //angularjs
                    {
                        src: "bower_components/angular/angular.min.js",
                        dest: "public/external/angular.js"
                    },
                    {
                        src: "bower_components/angular/angular.min.js.map",
                        dest: "public/external/angular.min.js.map"
                    },
                    {
                        src: "bower_components/angular-animate/angular-animate.min.js",
                        dest: "public/external/angular-animate.js"
                    },
                    {
                        src: "bower_components/angular-animate/angular-animate.min.js.map",
                        dest: "public/external/angular-animate.min.js.map"
                    },
                    {
                        src: "bower_components/angular-aria/angular-aria.min.js",
                        dest: "public/external/angular-aria.js"
                    },
                    {
                        src: "bower_components/angular-aria/angular-aria.min.js.map",
                        dest: "public/external/angular-aria.min.js.map"
                    },
                    //angularjs-message
                    {
                        src: "bower_components/angular-messages/angular-messages.min.js.map",
                        dest: "public/external/angular-messages.min.js.map"
                    },
                    {
                        src: "bower_components/angular-messages/angular-messages.min.js",
                        dest: "public/external/angular-messages.js"
                    },
                    //angularjs-material-designe
                    {
                        src: "bower_components/angular-material/angular-material.min.js",
                        dest: "public/external/angular-material.js"
                    },
                    {
                        src: "bower_components/angular-material/angular-material.min.css",
                        dest: "public/external/angular-material.css"
                    },
                    //angularjs-socket
                    {
                        src: "bower_components/angular-socket-io/socket.min.js",
                        dest: "public/external/angular-socket-io.js"
                    },
                    {
                        src: "bower_components/angular-socket-io/socket.min.js.map",
                        dest: "public/external/angular-socket-io.js.map"
                    },
                    //angularjs-route
                    {
                        src: "bower_components/angular-route/angular-route.min.js",
                        dest: "public/external/angular-route.js"
                    },
                    {
                        src: "bower_components/angular-route/angular-route.js.map",
                        dest: "public/external/angular-route.min.js.map"
                    },
                    //D3.js
                    {
                        src: "bower_components/d3/d3.min.js",
                        dest: "public/external/d3.js"
                    },
                    //angularjs-material-icon
                    {
                        src: "bower_components/angular-material-icons/angular-material-icons.min.js",
                        dest: "public/external/angular-material-icons.min.js"
                    },
                    //angularjs-context-menu
                    {
                        src: "bower_components/ng-context-menu/dist/ng-context-menu.min.js",
                        dest: "public/external/ng-context-menu.min.js"
                    },
                    //Config
                    {
                        src: "config/config_prod.js",
                        dest: "config/config.js"
                    },
                    {
                        src: "public/config/const_prod.js",
                        dest: "public/config/const.js"
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
                    //angularjs
                    {
                        src: "bower_components/angular/angular.js",
                        dest: "public/external/angular.js"
                    },
                    {
                        src: "bower_components/angular-mocks/angular-mocks.js",
                        dest: "public/test/libs/angular-mocks.js"
                    },
                    {
                        src: "bower_components/angular-animate/angular-animate.js",
                        dest: "public/external/angular-animate.js"
                    },
                    {
                        src: "bower_components/angular-aria/angular-aria.js",
                        dest: "public/external/angular-aria.js"
                    },
                    //angularjs-message
                    {
                        src: "bower_components/angular-messages/angular-messages.js",
                        dest: "public/external/angular-messages.js"
                    },
                    //angularjs-material-designe
                    {
                        src: "bower_components/angular-material/angular-material.js",
                        dest: "public/external/angular-material.js"
                    },
                    {
                        src: "bower_components/angular-material/angular-material.css",
                        dest: "public/external/angular-material.css"
                    },
                    //angularjs-socket
                    {
                        src: "bower_components/angular-socket-io/socket.js",
                        dest: "public/external/angular-socket-io.js"
                    },
                    //angularjs-route
                    {
                        src: "bower_components/angular-route/angular-route.js",
                        dest: "public/external/angular-route.js"
                    },
                    //D3.js
                    {
                        src: "bower_components/d3/d3.js",
                        dest: "public/external/d3.js"
                    },
                    //angularjs-material-icon
                    {
                        src: "bower_components/angular-material-icons/angular-material-icons.min.js",
                        dest: "public/external/angular-material-icons.min.js"
                    },
                    //angularjs-context-menu
                    {
                        src: "bower_components/ng-context-menu/dist/ng-context-menu.min.js",
                        dest: "public/external/ng-context-menu.min.js"
                    },
                    //Config
                    {
                        src: "config/config_dev.js",
                        dest: "config/config.js"
                    },
                    {
                        src: "public/config/const_dev.js",
                        dest: "public/config/const.js"
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
        simplemocha: {
            all:{
                options: {
                    timeout: 6000,
                    ignoreLeaks: true,
                    reporter: "progress",
                    tdd: "tdd"
                },
                src: "modules/**/test/*.js"
            }
        },
        watch: {
            mochaTest: {
                files: ["modules/**/*.js", "gruntfile.js"],
                options: {
                    reload: true
                },
                tasks: "simplemocha:all"
            }
        },
        less: {
            style: {
                options: {
                    compress: true
                },
                files: {
                    "public/css/style.css": 'public/css/style.less'
                }
            }
        }
    });

    grunt.registerTask("default", ["test_all"]);
    grunt.registerTask("less", ["less"]);

    //TEST//
    grunt.registerTask("test_server", ["simplemocha:all", "watch:mochaTest"]);
    grunt.registerTask("test_all", ["simplemocha:all", "karma:singleRun"]);
    grunt.registerTask("test_client", ["karma:unit"]);

    grunt.registerTask("test_all", ["karma:singleRun","simplemocha:all"]);

    //INSTALLATION
    grunt.registerTask("config_dev", ["bower:install", "copy:bowerDev"]);
    grunt.registerTask("config_prod", ["bower:install", "copy:bowerProd"]);

};
