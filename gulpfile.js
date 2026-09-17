const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

// 1. Compilando o Sass, adicionando auto-prefixer e dando refresh na página
function compilaSass() {
	return gulp
		.src("scss/*.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(postcss([autoprefixer]))
		.pipe(cleanCSS({ level: 2 }))
		.pipe(gulp.dest("./css/"))
		.pipe(browserSync.stream());
}
// Registra a tarefa do Sass com o nome correto
gulp.task("sass", compilaSass);

function pluginsCss() {
	return gulp
		.src("css/lib/*.css")
		.pipe(concat("plugins.css"))
		.pipe(gulp.dest("css/"))
		.pipe(browserSync.stream());
}

gulp.task("plugincss", pluginsCss);

// 2. Função para concatenar o Javascript
function gulpJs() {
	return gulp
		.src("js/scripts/*.js")
		.pipe(concat("all.js"))
		.pipe(
			babel({
				presets: ["@babel/preset-env"],
			})
		)
		.pipe(uglify())
		.pipe(gulp.dest("js/"))
		.pipe(browserSync.stream()); // Adicionado para atualizar a página quando o JS mudar!
}
gulp.task("alljs", gulpJs);

function pluginsJs() {
	return gulp
		.src(["./js/lib/aos.min.js", "./js/lib/swiper.min.js"])
		.pipe(concat("plugins.js"))
		.pipe(gulp.dest("js/"))
		.pipe(browserSync.stream());
}

gulp.task("pluginjs", pluginsJs);

// 3. Função do Browsersync
function browser() {
	browserSync.init({
		server: {
			baseDir: "./",
		},
	});
}
gulp.task("browser-sync", browser);

// 4. Função do Watch para alterações em Sass, Html e JS
function watch() {
	gulp.watch("scss/*.scss", compilaSass);
	gulp.watch("css/lib/*.css", pluginsCss);
	gulp.watch("*.html").on("change", browserSync.reload);
	gulp.watch("js/scripts/*.js", gulpJs);
	gulp.watch("js/lib/*.js", pluginsJs);
}
gulp.task("watch", watch);

// 5. Tarefa padrão (default) que roda tudo ao digitar apenas "gulp" no terminal
gulp.task("default", gulp.series(compilaSass, pluginsCss, gulpJs, pluginsJs));
gulp.task(
	"default",
	gulp.parallel(
		"watch",
		"browser-sync",
		"sass",
		"plugincss",
		"alljs",
		"pluginjs"
	)
);
