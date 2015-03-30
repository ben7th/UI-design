gulp    = require 'gulp'
util    = require 'gulp-util'
concat  = require 'gulp-concat'
smaps   = require 'gulp-sourcemaps'
coffee  = require 'gulp-coffee'
sass    = require 'gulp-ruby-sass'
haml    = require 'gulp-ruby-haml'

# 防止编译 coffee 过程中 watch 进程中止
plumber = require 'gulp-plumber'

# ----------------------------------
# 以下分工程来实现 task

# -------------------
# pinidea
pinidea =
  src: 
    js:   'pinidea/src/js/**/*.coffee'
    css:  'pinidea/src/css/**/*.scss'
    html: 'pinidea/src/html/**/*.haml'
    partial: 'pinidea/src/partial/**/*.haml'
  dist:
    js:   'pinidea/dist/js'
    css:  'pinidea/dist/css'
    html: 'pinidea/dist/html'

gulp.task 'pinidea-js', ->
  gulp.src pinidea.src.js
    .pipe plumber()
    .pipe smaps.init()
    .pipe coffee()
    .pipe smaps.write('../maps')
    .pipe gulp.dest(pinidea.dist.js)

gulp.task 'pinidea-css', ->
  gulp.src pinidea.src.css
    .pipe sass()
    .on 'error', (err)->
      file = err.message.match(/^error\s([\w\.]*)\s/)[1]
      util.log [
        err.plugin,
        util.colors.red file
        err.message
      ].join ' '
    .pipe concat('ui.css')
    .pipe gulp.dest(pinidea.dist.css)

gulp.task 'pinidea-html', ->
  gulp.src pinidea.src.html
    .pipe haml()
    .on 'error', (err)->
      util.log [
        err.plugin,
        util.colors.red err.message
        err.message
      ].join ' '
    .pipe gulp.dest(pinidea.dist.html)

gulp.task 'pinidea-build', [
  'pinidea-js', 'pinidea-css', 'pinidea-html'
]

gulp.task 'pinidea-watch', ['pinidea-build'], ->
  gulp.watch pinidea.src.js, ['pinidea-js']
  gulp.watch pinidea.src.css, ['pinidea-css']
  gulp.watch pinidea.src.html, ['pinidea-html']
  gulp.watch pinidea.src.partial, ['pinidea-html']