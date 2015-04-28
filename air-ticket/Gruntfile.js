module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			main: {
				files: [
				  // includes files within path and its sub-directories 
				  { expand: true, cwd: 'air-ticket-common/', src: ['air-ticket-server-interface/**'], dest: 'air-ticket-server/custom_modules/' },
				  { expand: true, cwd: 'air-ticket-common/', src: ['air-ticket-server-interface/**'], dest: 'air-ticket-client-angular/custom_modules/' }
				]
			}
		},
		watch: {
			scripts: {
				files: ['air-ticket-server-interface/**'],
				tasks: ['copy'],
				options: {
					spawn: false
				}
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['copy', 'watch']);
};