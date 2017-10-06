// les modules telechargé

var gulp = require('gulp');
var sass = require('gulp-sass');

var flatten = require('gulp-flatten');
var plumber = require('gulp-plumber'); // pour éviter que le serveur s'arréte à chaque erreur.
var notify = require('gulp-notify');
var cleanCss = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
//js

	gulp.task('sass', function(){
		gulp.src('public/assets/sass/*.scss')
			.pipe(plumber({
				errorHandler : notify.onError("Error = <%= error.message %>")
			}))
			.pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(cleanCss())
			.pipe(flatten())
			.pipe(gulp.dest('public/stylesheets'));
	});

	gulp.task('watch', function(){
		gulp.watch('assets/sass/**/*.scss',['sass']);
	});
