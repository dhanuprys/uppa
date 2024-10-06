# start http server
python3 -m http.server 8000 -b 127.0.0.1 -d /var/www/html/build &

# Install firefox utils
dpkg -i /root/libs/libnspr4.deb /root/libs/libevent2.1-7.deb

startfluxbox
