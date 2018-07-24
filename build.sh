#!/usr/bin/env bash

VERSION = 1.0
MINORVERSION = 1.1
RELEASE = 1

if [-n "$1" ]; then
	if [ "$1" -ge "$VERSION"]; then
		VERSION=$1
	fi
fi

DEBNAME = radio_web${VERSION}.${MINORVERSION}-${RELEASE}_all
HOME = ./${DEBNAME}/var/www/web_radio

mkddir -p ${HOME}

cp -r ./web_radio ${HOME}
cp ./wradio_nginx.conf ${HOME}
cp ./pip_requirements.txt ${HOME}
cp ./wradio_uwsgi.ini ${HOME}
cp ./readme.txt ${HOME}

mkdir -p ${HOME}

mkdir -p ./${DEBNAME}/etc/nginx/sites-available/
mkdir -p ./${DEBNAME}/etc/nginx/sites-enabled/
mkdir -p ./${DEBNAME}/etc/uwsgi/apps-available/
mkdir -p ./${DEBNAME}/etc/uwsgi/apps-enabled/

ln -s /var/www/web_radio/wradio_uwsgi.ini ${DEBNAME}/etc/uwsgi/apps-enabled/wradio_uwsgi.ini
ln -s /var/www/web_radio/wradio_nginx.conf ${DEBNAME}/etc/nginx/sites-enabled/wradio_nginx.conf

mkdir -p ./${DEBNAME}/DEBIAN
touch ./${DEBNAME}/DEBIAN/control
cat <<  STOP> ./${DEBNAME}/DEBIAN/control

Package: web_radio
Version: $VERSION.${MINORVERSION}-${RELEASE}
Architecture: all
Section: misc
Depends: python-dev, uwsgi, nginx
Description: interfacce for lungs cancer segmention
STOP

touch ./${DEBNAME}/DEBIAN/conffiles
cat <<CAT > ./${DEBNAME}/DEBIAN
STOP
fakeroot dpkg-deb --build ${DEBNAME}
rm -R ${DEBNAME}


fakeroot dpkg-deb --build ${DEBNAME}