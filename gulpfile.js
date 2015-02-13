'use strict';

var gulp = require('gulp');

var browserify = require('browserify');
var del        = require('del');
var prefix     = require('gulp-autoprefixer');
var rename     = require('gulp-rename');
var sass       = require('gulp-sass');
var transform  = require('vinyl-transform');

var basePaths = {
	src: './src',
	dest: './build'
};

var paths = {
	styles: {
		watch: basePaths.src + '/scss/**/*.scss',
		src: basePaths.src + '/scss/main.scss',
		dest: basePaths.dest + '/css'
	},
	scripts: {
		watch: basePaths.src + '/js/**/*.js',
		src: basePaths.src + '/js/main.js',
		dest: basePaths.dest + '/js'
	},
	pages: {
		watch: basePaths.src + '/html/**/*.html',
		src: basePaths.src + '/html/**/*.html',
		dest: basePaths.dest
	}
};

Object.keys(paths).forEach(function(type) {
	gulp.task('clean:' + type, function(done) {
		del(paths[type].dest + '/*.*', done);
	});
});

gulp.task('css-to-scss', function() {
	return gulp.src('./node_modules/normalize.css/*.css')
		.pipe(rename({
			prefix: '_',
			extname: '.scss'
		}))
		.pipe(gulp.dest('./tmp/scss'));
});

gulp.task('styles', ['clean:styles', 'css-to-scss'], function() {
	return gulp.src(paths.styles.src)
		.pipe(sass({
			includePaths: [
				'./tmp/scss'
			],
			outputStyle: 'compressed'
		}))
		.pipe(prefix())
		.pipe(gulp.dest(paths.styles.dest));
});

gulp.task('scripts', ['clean:scripts'], function() {
	var bundler = function() {
		return transform(function(filename) {
			var b = browserify(filename, {});
			return b.bundle();
		});
	};

	return gulp.src(paths.scripts.src)
		.pipe(bundler())
		.pipe(gulp.dest(paths.scripts.dest));
});

gulp.task('pages', ['clean:pages'], function() {
	return gulp.src(paths.pages.src)
		.pipe(gulp.dest(paths.pages.dest));
});

gulp.task('build', ['styles', 'scripts', 'pages']);
gulp.task('default', ['build'], function() {
	Object.keys(paths).forEach(function(type) {
		gulp.watch(paths[type].watch, [type]);
	});
});
