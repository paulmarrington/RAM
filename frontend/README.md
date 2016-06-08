# Build requirements #
1. You need to install SASS to compile scss files into css files. As part of SASS installation, you also need to install ruby. For complete instructions visit http://sass-lang.com/install
1. Install the visual c++ compile, more information visit [here](https://www.browsersync.io/docs/gulp/) and [here](https://stackoverflow.com/questions/33239445/could-not-install-prerender-using-npm-failed-to-locate-cl-exe)
1. npm i typescript jspm gulp-cli browser-sync -g
1. jspm install
 * if you get access error, you may need to force git to use https instead of git protocol to avoid firewall issues by executing _git config --global url."https://".insteadOf git://_
1. tsd install
1. gulp tasks:
  * clean - removes generated css and js files
  * ts:lint - applies typescript linting based on _tslint.json_ configuration file
  * ts:compile - applies _ts:lint_ and compiles typescript files and generates _javascript/app.js_
  * scss:compile - compiles app.scss file and generates _css/app.css_
  * ts:watch - looks for typescript files and if there is a change, calls _ts:compile_
  * scss:watch - looks for any change in the scss files and if it detects a change, calls _scss:compile_
  * serve - user browserSync to serve the root folder (/frontend) on port 3000. Moreover, this task also looks for any change in the files (.ts,.scss,.html, /data) and reloads the browser

1. To package the code (produces ~375kb gziped file with all dependencies)
 *  jspm bundle dist\js\frontend\typescript\Boot.js app.js --minify --skip-source-maps 

