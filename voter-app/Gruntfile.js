module.exports = function(grunt) {

    // replace this line with
    // grunt.loadNpmTasks("require-js");
    // if you use this example standalone
//    grunt.loadTasks("../../tasks");

    grunt.initConfig({

        // requirejs: {
        //     std: {
        //         options: {
        //             appDir: 'public2',
        //             mainConfigFile: 'public2/js/config.js',
        //             baseUrl: 'js/lib',
        //             dir: 'public2-built',
        //             paths: {
        //                 app2: '../app2'
        //             },
        //             // name: 'app2',
        //             // include: ['app2']
        //             modules: [  
        //                 {
        //                     name: "../app2",
        //                     include: [
        //                         "jquery"
        //                     ]
        //                 }
        //             ] 
        //         }
        //     }
        // },

    requirejs: {
      std: {
        options: {
          appDir: 'public',
          baseUrl: 'js',
          paths: {
              // app: '../mobile'
              // jquery: "jquery-1.9.1",

          },
          
          dir: 'public-built',
          
          mainConfigFile: 'public/js/mobile.js',

          modules: [
            //First set up the common build layer.
            {
              //module names are relative to baseUrl
              name: 'mobile'
              //List common dependencies here. Only need to list
              //top level dependencies, "include" will find
              //nested dependencies.
              // include: [
                // 'jquery', 'underscore', 'backbone'
              // ]
            }
          ]
        }
      }
    },

        less: {
            development: {
                options: {
                    paths:['public/less']
                },
                files: {
                    'public/css/musocracy.css': 'public/less/musocracy.less'
                }
            }
        },

        watch: {
            resources: {
                files: ['**/*.js', 'public/less/**/*.less', 'public/html/**/*.html'],
                tasks: ['dev-release'],
                options: {
                    debounceDelay: 250
                }
            }
        },

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                eqnull: true,
                browser: true,
                nomen: true
            },
            globals: {
                define: true
            }
        }
    });

    grunt.loadNpmTasks("grunt-requirejs");
    // grunt.loadNpmTasks("require-js");
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    // grunt.loadNpmTasks("grunt-connect");


    grunt.registerTask('dev-release', 'less:development');

    grunt.registerTask('default', ['jshint', 'requirejs:std']);
  grunt.registerTask('build', 'requirejs');

};