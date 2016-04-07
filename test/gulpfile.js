var $             = require('gulp-load-plugins')(),
    argv          = require('yargs').argv,
    browser       = require('browser-sync'),
    gulp          = require('gulp'),
    panini        = require('panini'),
    rimraf        = require('rimraf'),
    sequence      = require('run-sequence'),
    requireDir    = require('require-dir'),
    lazypipe      = require('lazypipe'),
    fs            = require('fs'),
    octophant     = require('octophant'),
    inky          = require('inky'),
    siphon        = require('siphon-media-query'),
    sherpa        = require('style-sherpa'),
    // Check for --production flag
    isProduction = !!(argv.production);

// requireDir('./tasks');


// Port to use for the development server.
var PORT = 8000;

    gulp.task('settings', function() {
      octophant([
        'bower_components/foundation-emails/scss/**/*.scss',
        'src/assets/scss/**/*.scss'
        ], {
        title: 'Foundation for Emails Settings',
        output: '../dist/_settings.scss',
        sort: ['global', 'grid', 'block-grid', 'type']
      });
    });

// Browsers to target when prefixing CSS.
var COMPATIBILITY = ['last 2 versions', 'ie >= 9'];
// File paths to various assets are defined here.
var PATHS = {
  assets: [
    'src/assets/**/*',
    '!src/assets/{!img,js,scss}/**/*'
  ],
  sass: [
    'bower_components/foundation-sites/scss',
    'bower_components/motion-ui/src/'
  ],
  javascript: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/what-input/what-input.js',
    'bower_components/foundation-sites/js/foundation.core.js',
    'bower_components/foundation-sites/js/foundation.util.*.js',
    // Paths to individual JS components defined below
    'bower_components/foundation-sites/js/foundation.abide.js',
    'bower_components/foundation-sites/js/foundation.accordion.js',
    'bower_components/foundation-sites/js/foundation.accordionMenu.js',
    'bower_components/foundation-sites/js/foundation.drilldown.js',
    'bower_components/foundation-sites/js/foundation.dropdown.js',
    'bower_components/foundation-sites/js/foundation.dropdownMenu.js',
    'bower_components/foundation-sites/js/foundation.equalizer.js',
    'bower_components/foundation-sites/js/foundation.interchange.js',
    'bower_components/foundation-sites/js/foundation.magellan.js',
    'bower_components/foundation-sites/js/foundation.offcanvas.js',
    'bower_components/foundation-sites/js/foundation.orbit.js',
    'bower_components/foundation-sites/js/foundation.responsiveMenu.js',
    'bower_components/foundation-sites/js/foundation.responsiveToggle.js',
    'bower_components/foundation-sites/js/foundation.reveal.js',
    'bower_components/foundation-sites/js/foundation.slider.js',
    'bower_components/foundation-sites/js/foundation.sticky.js',
    'bower_components/foundation-sites/js/foundation.tabs.js',
    'bower_components/foundation-sites/js/foundation.toggler.js',
    'bower_components/foundation-sites/js/foundation.tooltip.js',
    // Vendor
    'bower_components/motion-ui/dist/motion-ui.min.js',
    // 'bower_components/inputs/dist/js/inputs-min.js',
    // 'bower_components/wow/dist/wow.min.js',
    'src/assets/js/**/*.js',
    'src/assets/js/app.js'
  ]
};

//
/// These Tasks are used to compile an email template
//
  // This function is used to inline css and place the file in a style tag.
  function inliner(css) {
    var css = fs.readFileSync(css).toString();
    var mqCss = siphon(css);
    var pipe = lazypipe()
      .pipe($.inlineCss, {
        applyStyleTags: false,
        removeStyleTags: false
      })
      .pipe($.injectString.replace, '<!-- <style> -->', '<style>'+mqCss+'</style>')
      .pipe($.htmlmin, {
        collapseWhitespace: false,
        minifyCSS: true
      });
    return pipe();
  }
  gulp.task('inline', function() {
    gulp.src('dist/email.html')
      .pipe(inliner('dist/assets/css/ink.css'))
      // because html tables get messy real quick...
      .pipe($.prettify({ indent_size: 2 }))
      .pipe(gulp.dest('dist/'));
  });

  // Build the email folder by running all of the above tasks
  gulp.task('email', function(done) {
    sequence(
      'sass:email',
      'pages',
      'inline', 
    done);
  });


// Delete the "dist" folder
// This happens every time a build starts
gulp.task('clean', function(done) {
  rimraf('dist', done);
});

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
gulp.task('copy', function() {
  gulp.src(PATHS.assets)
    .pipe(gulp.dest('dist/assets'));
});



  gulp.task('pages', function() {
    return  gulp.src('src/pages/**/*.{html,hbs,handlebars}')
      .pipe(panini({
        root: 'src/pages',
        layouts: 'src/layouts/',
        data: 'src/data/',
        partials: 'src/partials',
        helpers: 'src/helpers'
      }))
      .pipe(inky())
      .pipe(gulp.dest('dist'));
  });
  
  gulp.task('pages:reset', function(cb) {
    panini.refresh();
    gulp.run('pages');
    cb();
  });

  gulp.task('styleguide', function(cb) {
    sherpa('src/styleguide/index.md', {
      output: 'dist/index.html',
      template: 'src/styleguide/index.html'
    }, cb);
  });


// Combine JavaScript into one file
// In production, the file is minified
  gulp.task('javascript', function() {
    var uglify = $.if(isProduction, $.uglify()
      .on('error', function (e) {
        console.log(e);
      }));

    return gulp.src(PATHS.javascript)
      .pipe($.sourcemaps.init())
      .pipe($.concat('app.js'))
      .pipe(uglify)
      .pipe($.if(!isProduction, $.sourcemaps.write()))
      .pipe(gulp.dest('dist/assets/js'));
  });

// Copy images to the "dist" folder
// In production, the images are compressed
gulp.task('images', function() {
  var imagemin = $.if(isProduction, $.imagemin({
    progressive: true
  }));

  return gulp.src('src/assets/img/**/*')
    .pipe(imagemin)
    .pipe(gulp.dest('dist/assets/img'));
});

// Compile Sass into CSS
// In production, the CSS is compressed
  gulp.task('sass:site', function() {
    return gulp.src('src/assets/scss/site.scss')
      .pipe($.sourcemaps.init())
      .pipe($.sass({ includePaths: [
        'bower_components/foundation-sites/scss',
        'bower_components/font-awesome/scss',
        'bower_components/motion-ui/src/'
      ] })
        .on('error', $.sass.logError)
      )
      .pipe($.autoprefixer({
        browsers: ['last 2 versions', 'ie >= 9']
      }))

      // Pleeease will combine mq, autoprefix and allow replace rem values
      .pipe($.pleeease({
        sass: true,
        includePaths: true,
        sourcemaps: true,
        mqpacker: true,
        rem: {
          rootValue: 16, 
          replace: true
        },
        pseudoElements: true,
        opacity: true,
        // If --production then minify css
        minifier: isProduction ? true : false,
      }))
      // .pipe($.if(!isProduction, $.sourcemaps.write()))
      .pipe(gulp.dest('dist/assets/css'));
  });

  gulp.task('sass:email', function() {
    return gulp.src('src/assets/scss/ink.scss')
      .pipe($.sass({ includePaths: [ 'bower_components/foundation-emails/scss', ]})
        .on('error', $.sass.logError)
      )
      .pipe($.autoprefixer({
        browsers: COMPATIBILITY
      }))
      .pipe($.pleeease({
        sass: true,
        includePaths: true,
        // sourcemaps: true,
        mqpacker: true,
        rem: {
          rootValue: 16, 
          replace: true
        },
        opacity: true,
        // If --production then minify css
        minifier: isProduction ? true : false,
      }))
      .pipe(gulp.dest('dist/assets/css'));
  });

  // Build complie both css for email and the site
  gulp.task('sass', function(done) {
    sequence(
      'sass:site',
      'sass:email',
    done);
  });


// Start a server with LiveReload to preview the site in
gulp.task('server', ['build'], function() {
  browser.init({
    server: 'dist', port: PORT
  });
});

// Build the "dist" folder by running all of the above tasks
gulp.task('build', function(done) {
  sequence('clean', ['sass', 'pages', 'javascript', 'images', 'copy'], ['styleguide','email'], done);
});

// Release
gulp.task('release', function() {
  // rimraf('dist', done);
  gulp.src('src/assets/scss/components/_inky_orbit.scss')
    .pipe(gulp.dest('../dist/scss'));
  gulp.src('src/data/orbit.yml')
    .pipe(gulp.dest('../dist/data'));
  gulp.src('src/partials/inky-orbit.html')
    .pipe(gulp.dest('../dist/partials'));
});


// Build the site, run the server, and watch for file changes
gulp.task('default', ['build', 'server'], function() {
  gulp.watch(PATHS.assets, ['copy', browser.reload]);
  // gulp.watch(['src/data/**/*.yml'], ['build', browser.reload]);
  gulp.watch(['src/pages/**/*.html'], ['pages', 'email', browser.reload]);
  gulp.watch(['src/{layouts,partials}/**/*.html'], ['pages:reset', browser.reload]);
  gulp.watch(['src/assets/scss/**/*.scss'], ['sass', browser.reload]);
  gulp.watch(['src/assets/js/**/*.js'], ['javascript', browser.reload]);
  gulp.watch(['src/assets/img/**/*'], ['images', browser.reload]);
  gulp.watch(['src/styleguide/**'], ['styleguide', browser.reload]);
});
