var gulp = require('gulp'),
	 less = require('gulp-less'),
	 minifyCss = require('gulp-clean-css'),
	 autoprefixer = require('gulp-autoprefixer'),
	 replace = require('gulp-html-replace'),
	 connect = require('gulp-connect'),
	 rigger = require('gulp-rigger'),
	 sourcemaps = require('gulp-sourcemaps'),
	 uglify = require('gulp-uglify'),
	 rimraf = require('rimraf'),
	 imagemin = require('gulp-imagemin'),
	 pngquant = require('imagemin-pngquant'),
	 livereload = require('livereload');

var settings = {
	minifyCss: ({
		compatibility: ['>1%', 'last 10 versions'],
		debug: true
		},
		function(details){
			console.log('до сжатия размер ' + details.name + ': ' + details.stats.originalSize + ' байт');
			console.log('после сжатия размер ' + details.name + ': ' + details.stats.minifiedSize + ' байт');
		}
	),
	autoprefixer: {
		browsers: ['> 1%','last 10 versions', 'ie >=7'],
		cascade: true
	},
	replace: {
		'css': './css/general.css',
		'js': [
			'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
			'./js/general.js'
		]
	},
	connect: {
		root: './build/',
		livereload: true
	}
};

var path = {
	src: {
		html: './dev/*.html',
		js: './dev/js/general.js',
		style: './dev/style/general.less',
		img: './dev/img/**/*.*',
		fonts: './dev/fonts/**/*.*'
	},
	build: {
		html: './build/',
		js: './build/js/',
		css: './build/css/',
		img: './build/img/',
		fonts: './build/fonts/'
	},
	watch: {
		html: './dev/**/*.html',
		js: './dev/js/**/*.js',
		style: {
			less: './dev/style/**/*.less',
			css: './dev/style/**/*.css'
		},
		img: './dev/img/**/*.*',
		fonts: './dev/fonts/**/*.*'
	},
	clean: './build'
};

gulp.task('clean', function (cb){
	rimraf(path.clean, cb);
});

gulp.task('htmlCreator', function(){
	 gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(replace(settings.replace))
		.pipe(gulp.dest(path.build.html))
		.pipe(connect.reload());
});

gulp.task('cssCreator', function(){
	gulp.src(path.src.style)
		.pipe(less())
		.pipe(autoprefixer(settings.autoprefixer))
		.pipe(minifyCss(settings.minifyCss))
		.pipe(gulp.dest(path.build.css))
		.pipe(connect.reload());
});

gulp.task('jsCreator', function (){
	gulp.src(path.src.js)
		.pipe(rigger())
		// .pipe(sourcemaps.init())
		.pipe(uglify())
		// .pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js))
		.pipe(connect.reload());
});

gulp.task('imageBuild', function (){
	gulp.src(path.src.img)
		.pipe(imagemin([
				imagemin.gifsicle({interlaced: true}),
				imagemin.jpegtran({progressive: true}),
				imagemin.optipng({optimizationLevel: 5}),
				imagemin.svgo({plugins: [{removeViewBox: false}]}),
				{use: [pngquant()]}
		]))
		.pipe(gulp.dest(path.build.img))
		.pipe(connect.reload());
});

gulp.task('webServer', function(){
	connect.server(settings.connect);
});

gulp.task('copyFiles', function(){
	gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts));
	gulp.src('./dev/favicon.ico').pipe(gulp.dest('./build/'));
});

gulp.task('default', function(){
	gulp.start('webServer', 'htmlCreator', 'cssCreator', 'jsCreator', 'imageBuild', 'copyFiles');

	gulp.watch([path.watch.html], function(event){
		gulp.start('htmlCreator');
	});

	gulp.watch([path.watch.style.less, path.watch.style.css], function(event){
		gulp.start('cssCreator');
	});

	gulp.watch([path.watch.js], function(event){
		gulp.start('jsCreator');
	});
});