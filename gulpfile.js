// require('es6-promise').polyfill();
// ////////////////////////////////////////
// Required
// ////////////////////////////////////////

var gulp = require('gulp'),
	htmlclean = require('gulp-htmlclean'),
	htmlreplace = require('gulp-html-replace'),
	es = require('event-stream'),
	concat = require('gulp-concat'),
	minifyCss = require('gulp-minify-css'),
	plumber = require('gulp-plumber'),
	uglify = require('gulp-uglify'),
	gutil = require('gulp-util'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	autoprefixer = require('gulp-autoprefixer'),
	reload = browserSync.reload;

// ////////////////////////////////////////
// # HTML Clean Task
// 
// This is not used to make the production code instead 'htmlcleanandreplace' is used
// ////////////////////////////////////////

gulp.task('htmlclean', function (){
	return gulp.src('src/*.html')
		.pipe(htmlclean())
		.pipe(gulp.dest('dist'));
});

// ////////////////////////////////////////
// # HTML Replace Task
// 
// to make this work tags need to added to the html 
// e.g.	<!-- build:css -->
//		<link rel="stylesheet" href="css/normalize.css">
//		<link rel="stylesheet" href="css/skeleton.css">
//		<!-- endbuild -->
//
//		<!-- build:js -->
//		<script type="text/javascript" src="js/functions.js"></script>
//		<script src="js/last-animation.js"></script>
//		<script src="js/embed.js"></script>
//		<!-- endbuild -->
//
// this is not used to make the production code (dist) instead 'htmlcleanandreplace' is used
// //////////////////////////////////////

gulp.task('htmlreplace', function() {
	return gulp.src('src/index.html')
		.pipe(htmlreplace({
			'css' : 'css/styles.min.css',
			'js' : 'js/functions.min.js'
		}))
		.pipe(gulp.dest('dist'))
		.pipe(reload({stream:true}));
});

// ////////////////////////////////////////
// # HTML Replaced and Cleaned Task
// 
// this uses event-stream to first replace css and js src files then cleans the html files
// //////////////////////////////////////

gulp.task('htmlcleanandreplace', function() {
	var replacedHtml = gulp.src('src/index.html')
		.pipe(htmlreplace({
			'css' : 'css/styles.min.css',
			'js' : 'js/functions.min.js'
		}));

	var htmlfiles = gulp.src('src/*.html');

	return es.merge(replacedHtml, htmlfiles)
		.pipe(htmlclean())
		.pipe(gulp.dest('dist'));
});

// ////////////////////////////////////////
// # Sass Task
//
// require
//   gulp-sass
//   plumber
// ////////////////////////////////////////

gulp.task('sass', function () {
	return gulp.src('src/sass/**/*.scss')
	.pipe(plumber()) // this keep the stream running if there is an error 
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest('src/css'))
	.pipe(reload({stream:true}));
});

// ////////////////////////////////////////
// # Sass and Css Task
//
// gulp-sass
// plumber
// ////////////////////////////////////////

gulp.task('sassandcss', function(){
	var sassCompiled = gulp.src('src/scss/**/*.scss')
		.pipe(plumber()) // this keep the stream running if there is an error 
		.pipe(sass().on('error', sass.logError));

	var cssConcat = gulp.src('src/css/*.css');
		
	return es.merge(sassCompiled, cssConcat)
		.pipe(plumber()) // this keep the stream running if there is an error 
		.pipe(concat('styles.min.css'))
		.pipe(minifyCss())
		.pipe(gulp.dest('dist/css'));
		// .pipe(reload({stream:true}));
		
});

// ////////////////////////////////////////
// # Styles Task
//	
// requires
//	gulp-concat
//	gulp-minify-css
//	gulp-plumber
//
// ////////////////////////////////////////

gulp.task('styles', function () {
	return gulp.src('src/css/*.css')
	.pipe(plumber()) // this keep the stream running if there is an error 
	.pipe(autoprefixer('last 2 versions'))
	.pipe(concat('styles.min.css'))
	.pipe(minifyCss())
	.pipe(gulp.dest('dist/css'));
});

// ////////////////////////////////////////
// # Move Task
// 
// moves files from src to dist 
// ////////////////////////////////////////

var filesToMove = [
		'./src/img/**/*.*',
		'./src/js/vendor/**/*.*',
		'./src/css/fonts/**/*.*',
		'./src/templates/**/*.*',
		'./src/ie8/**/*.*',
		'./src/favicon.ico'
	];

gulp.task('move' , function (){
	return gulp.src(filesToMove, { base: './src' })
	.pipe(gulp.dest('dist'))
	.pipe(reload({stream:true}));
});

// ////////////////////////////////////////
// # Scripts Task
//
// requires
//	gulp-concat
//	gulp-uglify
//	gulp-plumber
//	gutil
// ////////////////////////////////////////

gulp.task('scripts', function () {
	return gulp.src('src/js/*.js')
	.pipe(plumber()) // this keep the stream running if there is an error 
	.pipe(concat('functions.min.js'))
	.pipe(uglify().on('error',gutil.log))
	.pipe(gulp.dest('dist/js'))
	.pipe(reload({stream:true}));
});

// ////////////////////////////////////////
// browserSync Task
// ////////////////////////////////////////

gulp.task('browser-sync', function () {
	browserSync.init({
		server:{
			baseDir: "./dist/"
		}
	});
});

// ////////////////////////////////////////
// Watch Task
// ////////////////////////////////////////

gulp.task('watch', function () {
	gulp.watch('src/js/*.{js,coffee}', ['scripts']); // watches all the js and coffee files in 'src/js' then runs scripts task
	gulp.watch('src/css/*.css', ['styles']); // watches all the css files in 'src/css' then runs styles task
	gulp.watch('src/sass/**/*.scss', ['sass']); // watches all the scss files in 'src/scss' then runs styles task
	gulp.watch('src/*.html', ['htmlreplace']);
	gulp.watch('src/images/*.{png,jpg,jpeg,gif}', ['move']); // watches all the images 
	gulp.watch(filesToMove, { base: './src' }, ['move']); // watches all move files in 'src/' then runs move task
});

// ////////////////////////////////////////
// Default Task
// ////////////////////////////////////////

gulp.task('default', ['htmlreplace', 'scripts', 'sass', 'styles','move', 'browser-sync','watch']);

// ////////////////////////////////////////
// Things to add 
// * delete files that are deleted in the src file 
// * JSHint it better than JSLint 
// * add image compression 
// * css map
// ////////////////////////////////////////

