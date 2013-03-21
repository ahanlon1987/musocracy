module.exports = function (grunt) {

    grunt.initConfig({


        requirejs:{
            compile:{
                options:{
                    appDir:'public',
                    baseUrl:'js',
                    paths:{
                        // app: '../mobile'
                        // jquery: "jquery-1.9.1",

                    },

                    dir:'publicbuilt',

                    mainConfigFile:'public/js/app.js',

                    modules:[
                        {
                            name:'app'
                        }
                    ]
                }
            }
        },

        hogan:{
            compile:{
                options:{
                    prettify:true,
                    amdWrapper:true,
                    defaultName:function (filename) {
                        var name = filename.replace("public/templates/", "");
                        return name.replace(".hogan", "");
                    }
                },
                files:{
                    "public/js/templates.js":["public/templates/**/*.hogan"]
                }
            }
        },

        less:{
            compile:{
                options:{
                    paths:['public/less']
                },
                files:{
                    'public/css/app.css':'public/less/app.less'
                }
            }
        },

        cssmin:{
            compile:{
                files:{
                    'publicbuilt/css/app.css':['public/css/app.css']
                }
            }
        },

        watch:{
            templates: {
                files:['public/templates/**/*.hogan'],
                tasks:['hogan']
            },

            resources:{
                files:['**/*.js', 'public/less/**/*.less', 'public/html/**/*.html'],
                tasks:['dev-release'],
                options:{
                    debounceDelay:250
                }
            }
        },

        jshint:{
            options:{
                curly:true,
                eqeqeq:true,
                immed:true,
                latedef:true,
                newcap:true,
                noarg:true,
                sub:true,
                undef:true,
                eqnull:true,
                browser:true,
                nomen:true
            },
            globals:{
                define:true
            }
        }
    });

    grunt.loadNpmTasks("grunt-requirejs");
    // grunt.loadNpmTasks("require-js");
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-hogan');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks("grunt-connect");



    grunt.registerTask('default', ['jshint', 'requirejs:std']);
    grunt.registerTask('default', ['less:compile', 'cssmin:compile', 'hogan:compile', 'requirejs:compile']);
    grunt.registerTask('build', ['less:compile', 'cssmin:compile', 'hogan:compile', 'requirejs:compile']);

};