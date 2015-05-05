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
		}

	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['less', 'copy']);
};