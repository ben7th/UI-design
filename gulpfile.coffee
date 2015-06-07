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
    .pipe sass({
        "sourcemap=none": true
    })
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

# -------------------
# urlinfo
urlinfo =
  src: 
    js:   'urlinfo/src/js/**/*.coffee'
    css:  'urlinfo/src/css/**/*.scss'
    html: 'urlinfo/src/html/**/*.haml'
    partial: 'urlinfo/src/partial/**/*.haml'
  dist:
    js:   'urlinfo/dist/js'
    css:  'urlinfo/dist/css'
    html: 'urlinfo/dist/html'

gulp.task 'urlinfo-js', ->
  gulp.src urlinfo.src.js
    .pipe plumber()
    .pipe smaps.init()
    .pipe coffee()
    .pipe smaps.write('../maps')
    .pipe gulp.dest(urlinfo.dist.js)

gulp.task 'urlinfo-css', ->
  gulp.src urlinfo.src.css
    .pipe sass({
        "sourcemap=none": true
    })
    .on 'error', (err)->
      file = err.message.match(/^error\s([\w\.]*)\s/)[1]
      util.log [
        err.plugin,
        util.colors.red file
        err.message
      ].join ' '
    .pipe concat('ui.css')
    .pipe gulp.dest(urlinfo.dist.css)

gulp.task 'urlinfo-html', ->
  gulp.src urlinfo.src.html
    .pipe haml()
    .on 'error', (err)->
      util.log [
        err.plugin,
        util.colors.red err.message
        err.message
      ].join ' '
    .pipe gulp.dest(urlinfo.dist.html)

gulp.task 'urlinfo-build', [
  'urlinfo-js', 'urlinfo-css', 'urlinfo-html'
]

gulp.task 'urlinfo-watch', ['urlinfo-build'], ->
  gulp.watch urlinfo.src.js, ['urlinfo-js']
  gulp.watch urlinfo.src.css, ['urlinfo-css']
  gulp.watch urlinfo.src.html, ['urlinfo-html']
  gulp.watch urlinfo.src.partial, ['urlinfo-html']


# -------------------
# img4ye
img4ye =
  src: 
    js:   'img4ye/src/js/**/*.coffee'
    css:  'img4ye/src/css/**/*.scss'
    html: 'img4ye/src/html/**/*.haml'
    partial: 'img4ye/src/partial/**/*.haml'
  dist:
    js:   'img4ye/dist/js'
    css:  'img4ye/dist/css'
    html: 'img4ye/dist/html'

gulp.task 'img4ye-js', ->
  gulp.src img4ye.src.js
    .pipe plumber()
    .pipe smaps.init()
    .pipe coffee()
    .pipe smaps.write('../maps')
    .pipe gulp.dest(img4ye.dist.js)

gulp.task 'img4ye-css', ->
  gulp.src img4ye.src.css
    .pipe sass({
        "sourcemap=none": true
    })
    .on 'error', (err)->
      file = err.message.match(/^error\s([\w\.]*)\s/)[1]
      util.log [
        err.plugin,
        util.colors.red file
        err.message
      ].join ' '
    .pipe concat('ui.css')
    .pipe gulp.dest(img4ye.dist.css)

gulp.task 'img4ye-html', ->
  gulp.src img4ye.src.html
    .pipe haml()
    .on 'error', (err)->
      util.log [
        err.plugin,
        util.colors.red err.message
        err.message
      ].join ' '
    .pipe gulp.dest(img4ye.dist.html)

gulp.task 'img4ye-build', [
  'img4ye-js', 'img4ye-css', 'img4ye-html'
]

gulp.task 'img4ye-watch', ['img4ye-build'], ->
  gulp.watch img4ye.src.js, ['img4ye-js']
  gulp.watch img4ye.src.css, ['img4ye-css']
  gulp.watch img4ye.src.html, ['img4ye-html']
  gulp.watch img4ye.src.partial, ['img4ye-html']