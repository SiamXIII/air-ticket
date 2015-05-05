module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		less: {
			development: {
				files: {
					"build/theme.css": "src/theme.less"
				}
			}
		},

		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'node_modules/bootstrap/dist/js',
						src: ['bootstrap.min.js'],
						dest: 'build'
					},
					{
						expand: true,
						cwd: 'node_modules/bootstrap/dist/css',
						src: ['bootstrap.css'],
						dest: 'build'
					}

				]
			}
		},

		concat: {
			dist: {
				src: ['build/bootstrap.css', 'build/theme.css'],
				dest: 'build/styles.css'
			}
		},

		clean: ['build/theme.css', 'build/bootstrap.css']

	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['less', 'copy', 'concat', 'clean']);
};