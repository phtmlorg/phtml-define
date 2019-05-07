# Installing pHTML Define

[pHTML Define] runs in all Node environments, with special instructions for:

| [Node](#node) | [CLI](#phtml-cli) | [Eleventy](#eleventy) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- |

## Node

Add [pHTML Define] to your project:

```bash
npm install @phtmlorg/define --save-dev
```

Use [pHTML Define] to process your HTML:

```js
const phtmlDefine = require('@phtmlorg/define')

phtmlDefine.process(YOUR_HTML /*, processOptions, pluginOptions */)
```

Or use it as a [pHTML] plugin:

```js
const phtml = require('phtml')
const phtmlDefine = require('@phtmlorg/define')

phtml([
  phtmlDefine(/* pluginOptions */)
]).process(YOUR_HTML /*, processOptions */)
```

## CLI

Transform HTML files directly from the command line:

```bash
npx phtml source.html output.html -p @phtmlorg/define
```

Alternatively, add [pHTML Define] to your `phtml.config.js` configuration file:

```js
module.exports = {
  plugins: [
    ['@phtmlorg/define', /* pluginOptions */]
  ]
}
```

## Eleventy

Add [pHTML Eleventy] and [pHTML Define] to your Eleventy project:

```sh
npm install @phtmlorg/define @phtml/11ty --save-dev
```

Use [pHTML Eleventy] and [pHTML Define] in your Eleventy configuration:

```js
const phtml11ty = require('@phtml/11ty')
const phtmlDefine = require('@phtmlorg/define')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(phtml11ty, {
    use: [
      phtmlDefine(/* pluginOptions */)
    ]
  })
}
```

## Gulp

Add [Gulp pHTML] and [pHTML Define] to your project:

```bash
npm install @phtmlorg/define gulp-phtml --save-dev
```

Use [Gulp pHTML] and [pHTML Define] in your Gulpfile:

```js
const gulp = require('gulp')
const gulpPhtml = require('gulp-phtml')
const phtmlDefine = require('@phtmlorg/define')

gulp.task('html',
  () => gulp.src('./src/*.html').pipe(
    gulpPhtml({
      plugins: [
        phtmlDefine(/* pluginOptions */)
      ]
    })
  ).pipe(
    gulp.dest('dist')
  )
)
```

## Grunt

Add [Grunt pHTML] to your project:

```bash
npm install grunt-phtml --save-dev
```

Use [Grunt pHTML] and [pHTML Define] in your Gruntfile:

```js
const phtmlDefine = require('@phtmlorg/define')

grunt.loadNpmTasks('grunt-phtml')

grunt.initConfig({
  phtml: {
    options: {
      plugins: [
        phtmlDefine(/* pluginOptions */)
      ]
    },
    dist: {
      files: [{
        expand: true,
        src: 'src/*.html',
        dest: 'dest'
      }]
    }
  }
})
```

[Gulp pHTML]: https://github.com/phtmlorg/gulp-phtml
[Grunt pHTML]: https://github.com/phtmlorg/grunt-phtml
[pHTML]: https://github.com/phtmlorg/phtml
[pHTML Eleventy]: https://github.com/phtmlorg/phtml-11ty
[pHTML Define]: https://github.com/phtmlorg/phtml-define
