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
		},

		watch: {
			domain: {
				files: ['air-ticket-common/domain/*.js'],
				tasks: ['copy'],
				options: {
					spawn: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['copy', 'watch']);
};