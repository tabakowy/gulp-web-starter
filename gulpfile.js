// -------------------------------------------------
// 1. CONFIG
// -------------------------------------------------

// require gulp + plugins magic
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins();
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;


// -------------------------------------------------
// 2. DEFAULT TASKS
// -------------------------------------------------

// browserSync static server
gulp.task('sync', function() {
  browserSync.init({
    open: false, server: { baseDir: './dist' }
  });
});

// compile main Sass file
gulp.task('styles', function() {
  gulp.src('./src/styles/main.+(sass|scss)')
    .pipe(plugins.sass({ outputStyle: 'compressed' })
    .on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer())
    .pipe(plugins.rename({ suffix:'.min' }))
    .pipe(gulp.dest('./dist/assets/'))
    .pipe(browserSync.stream());
});

// minify and concat js files
gulp.task('scripts', function(){
  return gulp.src('./src/scripts/*.js')
    .pipe(plugins.plumber())
    .pipe(plugins.babel({ presets: ['env'] }))
    .pipe(plugins.concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/assets/'));
});

// compile templates to HTML
gulp.task('views', function buildHTML() {
  return gulp.src('./src/views/*.pug')
  .pipe(plugins.plumber())
  .pipe(plugins.pug({ pretty: true }))
  .pipe(gulp.dest('./dist/'))
});

// watch task
gulp.task('watch', function() {
  gulp.watch('./src/styles/**/*.+(scss|sass|css)', ['styles']);
  gulp.watch('./src/views/**/*.pug', ['views']);
  gulp.watch('./src/scripts/**/*.js', ['scripts'])
    .on('change', browserSync.reload);
  gulp.watch('./**/*.+(html)')
    .on('change', browserSync.reload);
});

// minify images
gulp.task('images', function(){
  return gulp.src( './src/img/**/*.+(png|jpg|gif|svg|ico)')
    .pipe(plugins.imagemin())
    .pipe(gulp.dest('./dest/assets/img/'))
});

// just default task
gulp.task('default', ['sync', 'styles', 'scripts', 'views', 'watch', 'images']);
