#!/bin/bash
echo > ram.install.log
if [ ! -d RAM ]; then
  echo "Clone RAM from GitHub..."
  if [ $# -eq 0 ]; then
    echo "Usage: ram-dev-win.sh your-git-username"
    exit 1
  fi
  if ! git clone https://github.com/$1/RAM; then
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
	git pull
fi

echo "npm update of frontend..."
cd frontend
npm update >> ../../ram.install.log
echo "npm update of backend..."
cd ../backend
npm update >> ../../ram.install.log
cd ..

if [ -d "/c/mongodb" ]; then
	echo "MongoDB already installed"
else
	echo "Installing MongoDB..."
	curl -SLO https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-3.2.3-signed.msi
	msiexec //passive //i mongo*.msi INSTALLLOCATION="C:\mongodb" ADDLOCAL="all"
	rm -f mongo*.msi
	mkdir /c/data /c/data/db
	/c/mongodb/bin/mongod
	cat > mongod.bat << EOF
	\\mongodb\\bin\\mongod.exe
EOF
fi
if [ -d "/c/Program Files\nodejs" ]; then
	echo "NodeJS already installed"
else
	echo "Installing NodeJS..."
	curl -SLO https://nodejs.org/dist/v4.3.1/node-v4.3.1-x64.msi
	msiexec //passive //i node*.msi INSTALLLOCATION="C:\nodejs" ADDLOCAL="all"
	rm -f node*.msi
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