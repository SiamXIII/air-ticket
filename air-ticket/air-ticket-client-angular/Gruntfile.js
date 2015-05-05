module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		less: {
			development: {
				files: {
					"build/styles.css": "src/css/styles.less"
				}
			}
		},

		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'bower_components/bootstrap/dist/css',
						src: ['bootstrap.css'],
						dest: 'build'
					},
					{
						expand: true,
						cwd: 'bower_components/bootstrap/dist/js',
						src: ['bootstrap.min.js'],
						dest: 'build'
					}
				]
			}
		},

		concat: {
			dist: {
				src: ['build/bootstrap.css', 'build/styles.css'],
				dest: 'build/bundle.css'
			}
		},

		clean: ['build/bootstrap.css', 'build/styles.css']
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['less', 'copy', 'concat', 'clean']);
};