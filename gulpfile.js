var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    rimraf = require('rimraf'),
    runSequence = require('run-sequence'),
    lazypipe = require('lazypipe'),
    wiredep = require('wiredep').stream;

var config = {
        app:  'app',
        dist: 'dist',
        tmp: '.tmp'
    },
    paths = {
        scripts: [config.app + '/scripts/**/*.js'],
        sass: [config.app + '/styles/**/*.scss'],
        css: [config.app + '/styles/**/*.css'],
        views: {
            main: config.app + '/index.html',
            files: [config.app + '/views/**/*.html']
        }
    };


var lintScripts = lazypipe()
    .pipe($.jshint, '.jshintrc')
    .pipe($.jshint.reporter, 'jshint-stylish');

var styles = lazypipe()
    .pipe($.sass, {
        outputStyle: 'expanded',
        precision: 10
    })
    .pipe($.autoprefixer, {
        browsers: ['ff < 20', 'last 2 versions', '> 1%', 'ie >= 8']
    })
    .pipe(gulp.dest, config.tmp + '/styles');


gulp.task('bower', function () {
    return gulp.src(paths.views.main)
        .pipe(wiredep({
            optional: 'configuration',
            goes: 'here'
        }))
        .pipe(gulp.dest(config.app));
});

gulp.task('clean:dist', function (cb) {
    rimraf(config.dist, cb);
});

gulp.task('styles', function () {
    return gulp.src(paths.sass)
        .pipe(styles());
});

gulp.task('sass:watch', function() {
    return gulp.watch(paths.sass, ['styles']);
});

gulp.task('lint', function () {
    return gulp.src(paths.scripts)
        .pipe(lintScripts());
});

gulp.task('bower_components', function () {
  return gulp.src([config.app + '/bower_components/**/*'])
    .pipe(gulp.dest(config.dist + '/bower_components'))
});

gulp.task('vendors', function () {
  return gulp.src([config.app + '/vendors/**/*'])
    .pipe(gulp.dest(config.dist + '/vendors'))
});

gulp.task('style', function () {
  return gulp.src([config.app + '/styles/**/*'])
    .pipe(gulp.dest(config.dist + '/styles'))
});

gulp.task('clean:tmp', function (cb) {
    rimraf(config.tmp, cb);
});

gulp.task('start:server', ['bower', 'styles', 'lint', 'sass:watch'], function() {
    $.connect.server({
        root: [config.app, config.tmp],
        livereload: false,
        port: 80
    });
});

gulp.task('client:build', ['html', 'styles','lint','bower_components','vendors','style'], function () {
    var jsFilter = $.filter('**/*.js', {restore: true}),
         cssFilter = $.filter('**/*.css', {restore: true}),
         htmlFilter = $.filter('**/*.html', {restore: true}),
         noIndexHtml = $.filter(['**/*', '!app/index.html'], {restore: true});

    return gulp.src(paths.views.main)
        .pipe($.useref({searchPath: [config.app, '.tmp']}))
        .pipe(jsFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe($.minifyCss({cache: true}))
        .pipe(cssFilter.restore)
        .pipe(htmlFilter)
        .pipe($.htmlmin({collapseWhitespace: true}))
        .pipe(htmlFilter.restore)
        .pipe(noIndexHtml)
        .pipe($.rev())
        .pipe(noIndexHtml.restore)
        .pipe($.revReplace())
        .pipe(gulp.dest(config.dist));
});


gulp.task('html', function () {
    return gulp.src(config.app + '/views/**/*')
        .pipe($.htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.dist + '/views'));
});

gulp.task('images', function() {
    return gulp.src(config.app + '/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(config.dist + '/images'));
});


gulp.task('copy:fonts', function () {
    return gulp.src(config.app + '/fonts/**/*')
        .pipe(gulp.dest(config.dist + '/fonts'));
});


gulp.task('archive', function() {
    return gulp.src(config.dist + '/**/*')
        .pipe($.tar('nshb-manager-front-end.tar'))
        .pipe($.gzip())
        .pipe(gulp.dest(config.dist));
});


gulp.task('copy:routes', function(){
    return gulp.src(config.app + '/routes.json')
        .pipe(gulp.dest(config.dist));
});

gulp.task('copy:resources', function(){
    return gulp.src(config.app + '/resources/**/*')
        .pipe(gulp.dest(config.dist + '/resources'));
});

gulp.task('build', ['clean:dist', 'clean:tmp', 'bower'], function() {
    runSequence(['images','copy:fonts', 'copy:routes', 'copy:resources'], 'client:build', 'archive');
});

gulp.task('default', ['start:server']);
