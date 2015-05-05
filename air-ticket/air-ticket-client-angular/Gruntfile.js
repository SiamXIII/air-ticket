module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'bower_components',
						src: ['bootstrap/less/**'],
						dest: 'assets/css/theme-default'
					},
					{
						expand: true,
						cwd: 'bower_components',
						src: ['bootstrap/less/**'],
						dest: 'assets/js/theme-default'
					}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['copy']);
};