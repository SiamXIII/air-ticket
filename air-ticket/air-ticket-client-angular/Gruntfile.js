/// <reference path="themes/default-theme/build/bootstrap.min.js" />
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'moduiles/default-theme/build',
						src: ['*'],
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

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['copy', 'concat', 'clean']);
};