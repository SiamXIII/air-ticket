module.exports = function (grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'air-ticket-common/',
						src: ['domain/**'],
						dest: 'air-ticket-server'
					},
					{
						expand: true,
						cwd: 'air-ticket-common/',
						src: ['domain/**'],
						dest: 'air-ticket-client-angular'
					}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');

	// Default task(s).
	grunt.registerTask('default', ['copy']);
};