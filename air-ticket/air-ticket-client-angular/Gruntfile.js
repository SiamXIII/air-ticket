/// <reference path="themes/default-theme/build/bootstrap.min.js" />
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'themes/default-theme/build',
						src: ['bootstrap.min.js'],
						dest: 'bundles'
					},
					{
						expand: true,
						cwd: 'themes/default-theme/build',
						src: ['styles.css'],
						dest: 'bundles'
					},
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['copy']);
};