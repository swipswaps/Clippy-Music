Clippy-Music
============

A music server written in NodeJS. Applicable for LAN parties.

Features
--------

* A priority queue is used to give a lower priority to users who've played more content recently.
* Pictures can be displayed over music or video.
* Uniqueness of music and pictures is enforced until after a chosen length of time has passed since it was last played/shown.
* A time range within the music file can be chosen for playing
* A nickname can be chosen by each user, which can be changed at any time.
* The process continues from where it was stopped the last time it was closed down.

Other Features
--------------

* A detailed log file of each item played, containing the IP address, file names, and the time at which the content was played.

Installation
------------

### Dependencies:

All available from the links given. It's also likely you can get them from your package manager.

* [eog](https://github.com/GNOME/eog)
* [mpv](https://mpv.io/)
* [youtube-dl](https://rg3.github.io/youtube-dl/)

```
git clone https://github.com/Deskbot/Clippy-Music
cd Clippy-Music
npm install
```

Set Up
--------

Clippy Music works out of the box.

To customise the options you first ought to overwrite `options.js` with a copy of `default_options.js` before editing `options.js` because it is a symbolic link by default.

Run
---

```
sudo node main.js
```

If you intend to expose the web page on port 80 and have a web server installed such as Apache2, you may have to run `sudo service apache2 stop` or expose Clippy Music on a different port and [configure your server](https://wiwifos.blogspot.com/2017/09/apache2-port-rerouting.html) to reroute port 80 to Clippy Music's port.

### Options

* `-c --clean`: deletes all stored data that would otherwise be reloaded between runs
* `--no-admin`: removes need for admin password, however users can't be banned


Update
------

```
./update.sh
```

This should work. Essentially it does a `git pull` and uses `pip` or `youtube-dl` to update `youtube-dl`.

Controls
--------

* End the current song: hit the **'end'** key in the terminal
* Close the server: hit **ctrl+c**

User API
--------

### POST /api/content/upload

Use:
```
curl --form "var1=val1;file1=@/my/file/path" [url]/api/path
```

Variables
* music-file (file)
* music-url
* image-file (file)
* image-url

For all of the following use:

```
curl --data "var1=val1&var2=val2" [url]/api/path
```

### POST /api/content/remove

Variables
* content-id

### POST /api/nickname/set

Variables
* nickname

Admin API
---------

### POST /api/content/kill

```
curl --data 'password=[AdminPassword]' [url]/api/content/kill
```

A tool exists for banning and unbanning. Run `node banTool.js`. Otherwise:

### POST /api/ban/add

```
curl --data 'id=[UserToBanIp]&password=[AdminPassword]' [url]/api/ban/add
```

### POST /api/ban/remove
```
curl --data 'id=[UserToUnBanIp]&password=[AdminPassword]' [url]/api/ban/remove
```

Contributions
-------------

Please contribute, preferably with code, issues on GitHub is fine.

License
-------

* You must use this music server
* You may not use this software to make money
