#!/bin/bash
bd="$(pwd)"
echo > $bd/ram.install.log
if [ ! -d RAM ]; then
  echo "Clone RAM from GitHub..."
  if [ $# -eq 0 ]; then
    echo "Usage: ram-dev-win.sh your-git-username"
    exit 1
  fi
  if ! git clone https://github.com/$1/RAM >> $bd/ram.install.log; then
    echo "Git clone failed."
    echo "Is $1 your git user name?"
    echo "or have you not forked atogov/RAM yet?"
    exit 2
  fi
	cd RAM
  git checkout develop
else
	echo "RAM already cloned - updating..."
	cd RAM
  git checkout develop
	git pull >> $bd/ram.install.log
fi

# need python for npm binary installs
if [ -e /c/Python27/python.exe ]; then
  echo "Python already installed"
else
  echo "Installing Python..."
	curl -SLO https://www.python.org/ftp/python/2.7.11/python-2.7.11.amd64.msi
	msiexec //passive //i python*.msi
	rm -f python*.msi
fi
export PATH=/c/Python27:$PATH

if [ -d "/c/Program Files\nodejs" ]; then
	echo "NodeJS already installed"
else
	echo "Installing NodeJS..."
	curl -SLO https://nodejs.org/dist/v4.3.1/node-v4.3.1-x64.msi
	msiexec //passive //i node*.msi INSTALLLOCATION="C:\nodejs" ADDLOCAL="all"
	rm -f node*.msi
fi
export PATH=/c/Program\ Files/nodejs:$PATH

echo "Installing Developer NPM Packages..."
cd ..
function npm_module() {
  if [ -d "$bd/node_modules/$1" ]; then
    echo "  Updating $1..."
    npm update $1 >> $bd/ram.install.log
  else
    echo "  Installing $1..."
    npm install $1 >> $bd/ram.install.log
  fi
}
npm_module gulp
npm_module tsd
npm_module typings
npm_module jspm
npm_module pm2
npm_module jasmine
wd=$(pwd)
export PATH=$bd/node_modules/.bin:$PATH

echo "Runtime update of frontend..."
cd $bd/RAM/frontend
echo "  npm..."
npm install >> $bd/ram.install.log
echo "  tsd..."
tsd install >> $bd/ram.install.log
echo "  jspm..."
jspm install >> $bd/ram.install.log

echo "Runtime update of backend..."
cd $bd/RAM/backend
echo "  npm..."
npm update >> $bd/ram.install.log
echo "  tsd..."
tsd install >> $bd/ram.install.log
cd ..

cat > $bd/ram.sh << EOF
#!/bin/bash
rswd="\$(cd \$(dirname "\$0"); pwd)"
export PATH=\$rswd/node_modules/.bin:\$PATH
export RAM_CONF="\$rswd/RAM/backend/conf/conf.js"
if [ \$# -eq 0 ]; then
  echo "Usage: \$rswd/ram.sh [frontend|backend|..] cmd"
  echo "  where cmd is"
  echo "    gulp [serve|clean|publish:zip]"
  echo "    npm  [install|update]"
  echo "    jspm install"
  echo "    tsd  install"
  echo "    pm2  [start|restart|stop|logs|...]"
  exit 1
fi
/c/mongodb/bin/mongod.exe >> mongod.log&
cd "\$rswd/RAM/\$1"
shift
\$@
EOF

if [ -d "/c/mongodb" ]; then
	echo "MongoDB already installed"
else
	echo "Installing MongoDB..."
	curl -SLO https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-3.2.3-signed.msi
	msiexec //passive //i mongo*.msi INSTALLLOCATION="C:\mongodb" ADDLOCAL="all"
	rm -f mongo*.msi
	mkdir /c/data /c/data/db
fi
if [ -e "/c/Program Files (x86)/Microsoft VS Code/Code.exe" ]; then
  echo "Visual Studio Code already installed"
else
  echo "Installing Visual Studio Code..."
	curl -SLO https://az764295.vo.msecnd.net/stable/db71ac615ddf9f33b133ff2536f5d33a77d4774e/VSCodeSetup-stable.exe
	./VSCode*.exe
	rm VSCode*.exe
fi
echo "Review ram.install.log for more detail"
$bd/ram.sh