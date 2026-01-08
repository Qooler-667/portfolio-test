import gulp from "gulp";
import { src, dest, watch, series, parallel } from "gulp";
import ttf2woff2 from "gulp-ttf2woff2";
import browserSync from "browser-sync";
import terser from "gulp-terser";
import concat from "gulp-concat";
import fileInclude from "gulp-file-include";
import autoprefixer from "gulp-autoprefixer";
import cleanCss from "gulp-clean-css";
import { deleteAsync } from "del";

// Новые плагины для картинок и спрайтов
import imagemin from "gulp-imagemin";
import webp from "gulp-webp";
import svgSprite from "gulp-svg-sprite";
import cheerio from "gulp-cheerio";
import replace from "gulp-replace";

const bs = browserSync.create();

// 1. Очистка
async function cleanDist() {
  return await deleteAsync(["docs"]);
}

// 2. HTML
function html() {
  return src("src/*.html")
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "./src/",
      })
    )
    .on("error", function (err) {
      console.error(err);
      this.emit("end");
    })
    .pipe(dest("docs"))
    .pipe(bs.stream());
}

// 3. CSS
function styles() {
  return src("src/styles/**/*.css")
    .pipe(autoprefixer({ overrideBrowserslist: ["last 10 versions"] }))
    .pipe(concat("main.min.css"))
    .pipe(cleanCss())
    .pipe(dest("docs/styles"))
    .pipe(bs.stream());
}

// 4. JS
function scripts() {
  return src("src/js/**/*.js")
    .pipe(concat("main.min.js"))
    .pipe(terser())
    .pipe(dest("docs/js"))
    .pipe(bs.stream());
}

// 5. Fonts TTF → WOFF2
function fonts() {
  return src("src/fonts/**/*.ttf", { encoding: false })
    .pipe(ttf2woff2())
    .pipe(dest("docs/fonts"))
    .pipe(bs.stream());
}

// 6. Images (Оптимизация + WebP)
function images() {
  return src(["src/images/**/*", "!src/images/icons/**/*"], { encoding: false })
    .pipe(webp())
    .pipe(dest("docs/images"))
    .pipe(
      src(["src/images/**/*", "!src/images/icons/**/*"], { encoding: false })
    )
    .pipe(imagemin())
    .pipe(dest("docs/images"))
    .pipe(bs.stream());
}

// 7. SVG Sprite (Сборка и очистка)
function sprite() {
  return src("src/images/icons/**/*.svg")
    .pipe(
      cheerio({
        run: function ($) {
          $("[fill]").removeAttr("fill");
          $("[stroke]").removeAttr("stroke");
          $("[style]").removeAttr("style");
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(replace("&gt;", ">"))
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../stack.svg",
          },
        },
      })
    )
    .pipe(dest("docs/images/icons"))
    .pipe(bs.stream());
}

// 8. Server
function server() {
  bs.init({
    server: { baseDir: "docs" },
    notify: false,
  });
}

// 9. Watch
function watching() {
  watch(["src/js/**/*.js"], scripts);
  watch(["src/styles/**/*.css"], styles);
  watch(["src/**/*.html"], html);
  watch(["src/images/**/*", "!src/images/icons/**/*"], images);
  watch(["src/images/icons/**/*.svg"], sprite);
  watch(["src/fonts/**/*"], fonts);
}

// Экспорт задач
export { html, styles, scripts, fonts, images, sprite, cleanDist };

// Дефолтный сценарий
export default series(
  cleanDist,
  parallel(fonts, html, styles, scripts, images, sprite),
  parallel(server, watching)
);
