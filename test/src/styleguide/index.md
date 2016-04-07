# Getting Started

  ## Install with bower

  ```
  bower install inky-orbit
  ```

  ## Integrate with Gulp
  Use this task to quickly copy the files over.
  ```
  gulp.task('copy', function() {
    gulp.src('bower_components/inky-orbit/dist/scss/_inky_orbit.scss')
      .pipe(gulp.dest('src/assets/scss/components'));
    gulp.src('bower_components/inky-orbit/dist/data/orbit.yml'')
      .pipe(gulp.dest('src/dist/data'));
    gulp.src('bower_components/inky-orbit/dist/partials/inky-orbit.html')
      .pipe(gulp.dest('src/dist/partials'));
  });
  ```

  ## Modify your sass task
  Inky-Orbit uses rem values.

  Since foundation doesn't use pleeease... you will need to run npm install --save-dev gulp pleeease and then modify your sass settings.
  ```
    gulp.task('sass:email', function() {
      return gulp.src('src/assets/scss/app.scss')
        .pipe($.sass({ includePaths: [ 'bower_components/foundation-emails/scss', ]})
          .on('error', $.sass.logError)
        )
        .pipe($.autoprefixer({
          browsers: COMPATIBILITY
        }))
        .pipe($.pleeease({
          sass: true,
          includePaths: true,

          // This will combine media queries
          mqpacker: true,

          // This will allow convert rem to px
          rem: {
            rootValue: 16, 
            replace: true
          },
          opacity: true,
          minifier: isProduction ? true : false,
        }))
        .pipe(gulp.dest('dist/assets/css'));
    });
  ```

  ## Integrate with Octophant
  ```
    // Generates a Sass settings file from the current codebase
    gulp.task('settings', function() {
      octophant([
        'bower_components/foundation-emails/scss/**/*.scss',
        'bower_components/inky-emails/dist/**/*.scss',
        ], {
        title: 'Foundation for Emails Settings',
        output: 'src/assets/scss/_settings.scss',
        sort: ['global', 'grid', 'block-grid', 'type']
      });
    });
  ```



# Include SCSS

  ```
  $orbit-classes: (
    inky-orbit: orbit,
    container: orbit-container,
    slide: orbit-slide,
    bullets: thumb-carousel,
  ) !default;

  $orbit: (
    default: 580px,
    border: #444444,
    border-width: 2px,
    lineheight: 0,
    margin: 1% 0.61%,
    thumb: 50px,
    width: 17.5%, 
    img-width: 450px,
    img-height: 280px,
    small-width: 100%,
  ) !default;


  ```




# Include partial
  ## Describe how it works

  ```
  <table class="inky-orbit" cellpadding=0 cellspacing=0 border=0 width="450">
   <tr>
      <td>
         <!--[if !mso]><!-- -->
         <input type=radio class="cboxcheck" summary="cboxcheck" style="display:none !important;" checked>
         <div>
            <div class="thumb-carousel " summary="thumb-carousel">
               {{#each orbit.orbit}}
               <label>
                  <input type="radio" name="car-rd1" class="cbox{{slide}}" summary="cbox{{slide}}" style="{{style}}" {{checked}}>
                  <span>
               {{/each}}
               {{#each orbit.slide}}
               <div class="content-{{slide}} slide-content" summary="content-{{slide}}">
                  <a href="{{url}}">
                     <img src="{{img}}" alt="{{title}}" alt="" style="display:block;max-height:0" border=0 >
                  </a>
               </div>
               {{/each}}
               {{#each orbit.thumbnail}}
                     <span class="thumb" summary="thumb">
                        <img src="{{img}}">
                     </span>
                  </span>
               </label>
               {{/each}}
         </div>
         <!--<![endif]-->
            <div class="fallback " summary="fallback">
               <div class="slide-content" summary="slide-content">
                  <a href="{{orbit.site}}">
                     <img src="{{orbit.fallback}}" alt="."style="display:block;" border=0 >
                  </a>
               </div>
            </div>
         </div>
      </td>
   </tr>
  </table>
  ```




# Use Data

  ## Describe how it works
  ```
  gulp.task('pages', function() {
    return  gulp.src('src/pages/**/*.{html,hbs,handlebars}')
      .pipe(panini({
        data: [
          'src/data/', 
          'bower_components/inky-orbit/dist/**/*.yml'
        ],
        partials: [
          'src/partials', 
          'bower_components/inky-orbit/dist/**/*.html'
        ],
      }))
      .pipe(inky())
      .pipe(gulp.dest('dist'));
  });
  ```


  ```
  site: http://www.zurb.com/
  fallback: http://foundation.zurb.com/assets/img/foundation-emails/inky-with-emailicons.jpg
  orbit:
    -
      title: transactional
      slide: 3
      img: http://foundation.zurb.com/assets/img/foundation-emails/icons/transactional.svg
      style: display:none !important;
      checked: 
    -
      title: marketing
      slide: 2
      img: http://foundation.zurb.com/assets/img/foundation-emails/icons/marketing.svg
      style: display:none !important;
      checked: 
    -
      title: drip
      slide: 1
      img: http://foundation.zurb.com/assets/img/foundation-emails/icons/drip.svg
      style: display:none !important;
      checked: checked
  slide:
    -
      title: transactional
      url: http://foundation.zurb.com/emails/transactional.html
      slide: 1
      img: http://foundation.zurb.com/assets/img/foundation-emails/inky-with-emailicons.jpg
    -
      title: marketing
      url: http://foundation.zurb.com/emails/marketing.html
      slide: 2
      img: http://foundation.zurb.com/assets/img/inky-class.png
    -
      title: drip
      url: http://foundation.zurb.com/emails/drip.html
      slide: 3
      img: http://foundation.zurb.com/assets/img/foundation-emails/icons/drip.svg
  thumbnail:
    -
      img: http://foundation.zurb.com/assets/img/foundation-emails/icons/transactional.svg
    -
      img: http://foundation.zurb.com/assets/img/foundation-emails/icons/marketing.svg
    -
      img: http://foundation.zurb.com/assets/img/foundation-emails/icons/drip.svg
  ```

