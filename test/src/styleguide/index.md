# Getting Started

  Inky-Orbit is designed to integrate easily with the default [Foundation-Email-Template](https://github.com/zurb/foundation-emails-template). That being said, there are a few minor tid-bits for automated integration.

  ## Start An Email Template like normal
    ### Foundation CLI
      ```bash
      npm install foundation-cli --global
      ```

      Use this command to set up a blank Foundation for Emails project:

      ```bash
      foundation new --framework emails
      ```

      The CLI will prompt you to give your project a name. The template will be downloaded into a folder with this name.

# Install the Plugins

  ## Insall Manually
  ```bash
  git clone https://github.com/hansUXdev/inky-orbit bower_components
  ```

  ## Install with bower (Not Ready yet)
  ```bash
  bower install inky-orbit
  ```

  ## Update your package.json
  ```
  npm install -- save-dev octophant
  npm install -- save-dev gulp-pleeease
  ```

  ## Integrate with Gulp


  Copy and Paste this task in your gulpfile to quickly add all the files you need.
  Use this task to quickly copy the files over.
  ```
  gulp.task('copy:orbit', function() {
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
        root: 'src/pages',
        layouts: 'src/layouts',
        data: 'src/data/',
        partials: 'src/partials',
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




# Vanilia Html

```html_example
    <style>
      @media screen and (max-width:9999px) {
        * [summary=cboxcheck]:checked+* [summary^=thumb-carousel],
        .cboxcheck:checked+* .thumb-carousel {
          height: auto!important;
          max-height: none!important;
          line-height: 0
        }
        * [summary^=thumb-carousel] span,
        .thumb-carousel span {
          font-size: 0;
          line-height: 0
        }
        * [summary=cboxcheck]:checked+* [summary^=thumb-carousel] [summary^=content],
        .cboxcheck:checked+* .thumb-carousel .slide-content {
          display: none;
          max-height: 0;
          overflow: hidden
        }
        * [summary^=thumb-carousel] [summary=cbox1]:checked+span [summary=content-1],
        * [summary^=thumb-carousel] [summary=cbox2]:checked+span [summary=content-2],
        * [summary^=thumb-carousel] [summary=cbox3]:checked+span [summary=content-3],
        * [summary^=thumb-carousel] [summary=cbox4]:checked+span [summary=content-4],
        * [summary^=thumb-carousel] [summary=cbox5]:checked+span [summary=content-5],
        .thumb-carousel .cbox1:checked+span .content-1,
        .thumb-carousel .cbox2:checked+span .content-2,
        .thumb-carousel .cbox3:checked+span .content-3,
        .thumb-carousel .cbox4:checked+span .content-4,
        .thumb-carousel .cbox5:checked+span .content-5 {
          display: block!important;
          max-height: none!important;
          overflow: visible!important
        }
        * [summary^=thumb-carousel] [summary=thumb],
        .thumb-carousel .thumb {
          cursor: pointer;
          display: inline-block;
          width: 17.5%;
          margin: 1% .61%;
          border: 2px solid #bbb
        }
        * [summary^=thumb-carousel] [summary=thumb]:hover,
        .thumb-carousel .thumb:hover {
          border: 2px solid #444
        }
        * [summary^=thumb-carousel] [summary^=cbox]:checked+span>span,
        .thumb-carousel input:checked+span>span {
          border-color: #444
        }
        * [summary^=thumb-carousel] [summary=thumb] img,
        .thumb-carousel .thumb img {
          width: 100%;
          height: auto
        }
        * [summary^=thumb-carousel] img,
        .thumb-carousel img {
          max-height: none!important
        }
        .cboxcheck:checked+* .fallback {
          display: none!important;
          display: none;
          max-height: 0;
          height: 0;
          overflow: hidden
        }
        * [summary=cboxcheck]:checked+* [summary=fallback] {
          max-height: 0;
          height: 0;
          overflow: hidden
        }
      }
      
      @media screen and (max-width:580px) {
        .inky-orbit,
        .inky-orbit .fallback .slide-content img,
        .inky-orbit .thumb-carousel,
        .inky-orbit .thumb-carousel .slide-content img {
          width: 100%!important;
          height: auto
        }
      }
    </style>
    <table class="inky-orbit text-center" cellpadding="0" cellspacing="0" border="0" width="450" align="center" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:center;vertical-align:top">
      <tr style="padding:0;text-align:left;vertical-align:top">
        <td style="-moz-hyphens:auto;-ms-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:19px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
          <!--[if !mso]><!-- --><input type="radio" class="cboxcheck" summary="cboxcheck" style="display:none!important" checked="checked">
          <div>
            <div class="thumb-carousel" summary="thumb-carousel" style="height:0;max-height:0;overflow:hidden;text-align:center;width:450px"> <label>
                            <input type="radio" name="car-rd1" class="cbox3" summary="cbox3" style="display:none!important">
                            <span>
                         <label>
                            <input type="radio" name="car-rd1" class="cbox2" summary="cbox2" style="display:none!important">
                            <span>
                         <label>
                            <input type="radio" name="car-rd1" class="cbox1" summary="cbox1" style="display:none!important" checked="checked">
                            <span>
                         <div class="content-1 slide-content" summary="content-1">
                            <a href="http://foundation.zurb.com/emails/transactional.html" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none">
                               <img src="http://foundation.zurb.com/assets/img/foundation-emails/inky-with-emailicons.jpg" alt="transactional" style="-ms-interpolation-mode:bicubic;border:none;clear:both;display:block;max-height:0;max-width:100%;outline:0;text-decoration:none;width:auto" border="0">
                            </a>
                         </div>
                         <div class="content-2 slide-content" summary="content-2">
                            <a href="http://foundation.zurb.com/emails/marketing.html" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none">
                               <img src="http://foundation.zurb.com/assets/img/inky-class.png" alt="marketing" style="-ms-interpolation-mode:bicubic;border:none;clear:both;display:block;max-height:0;max-width:100%;outline:0;text-decoration:none;width:auto" border="0">
                            </a>
                         </div>
                         <div class="content-3 slide-content" summary="content-3">
                            <a href="http://foundation.zurb.com/emails/drip.html" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none">
                               <img src="http://foundation.zurb.com/assets/img/foundation-emails/icons/drip.svg" alt="drip" style="-ms-interpolation-mode:bicubic;border:none;clear:both;display:block;max-height:0;max-width:100%;outline:0;text-decoration:none;width:auto" border="0">
                            </a>
                         </div>
                               <span class="thumb" summary="thumb">
                                  <img src="http://foundation.zurb.com/assets/img/foundation-emails/icons/transactional.svg" style="-ms-interpolation-mode:bicubic;border:0;clear:both;display:block;max-height:0;max-width:100%;outline:0;text-decoration:none;width:50px">
                               </span>
                            </span>
                         </label> <span class="thumb" summary="thumb">
                                  <img src="http://foundation.zurb.com/assets/img/foundation-emails/icons/marketing.svg" style="-ms-interpolation-mode:bicubic;border:0;clear:both;display:block;max-height:0;max-width:100%;outline:0;text-decoration:none;width:50px">
                               </span> </span>
              </label> <span class="thumb" summary="thumb">
                                  <img src="http://foundation.zurb.com/assets/img/foundation-emails/icons/drip.svg" style="-ms-interpolation-mode:bicubic;border:0;clear:both;display:block;max-height:0;max-width:100%;outline:0;text-decoration:none;width:50px">
                               </span> </span>
              </label>
            </div>
            <!--<![endif]-->
            <div class="fallback" summary="fallback">
              <div class="slide-content" summary="slide-content">
                <a href="http://www.zurb.com/" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none"> <img src="http://foundation.zurb.com/assets/img/foundation-emails/inky-with-emailicons.jpg" alt="." style="-ms-interpolation-mode:bicubic;border:none;clear:both;display:block;height:280px;max-width:100%;outline:0;text-decoration:none;width:450px"
                    border="0"> </a>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </table>

```
