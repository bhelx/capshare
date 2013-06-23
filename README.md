# capshare

capshare is a really fast way to share a screencapture. It's a background daemon for OS X so once you set it up it's always running.

## How it works

The capshare daemon watches a specified folder on your machine. When a file is added to that folder it immediately uploads the file to an s3 bucket and copies the https link to your clipboard.

Because it's just a folder it will also work if you drag or copy an image to that folder.

## Dependencies

* Node.js
* An s3 bucket
* OS X

## Installation

Use npm to install the capshare binary

```bash
npm install -g capshare
```

## Setup

### OS X

You'll want to change the folder where your screen captures are saved.

```bash
defaults write com.apple.screencapture location ~/Pictures/capshare && killall SystemUIServer
```

Here I am using *~/Pictures/capshare*.

Then you will want to setup the launchd config:

```bash
curl https://raw.github.com/bhelx/capshare/master/config/osx/com.bhelx.capshare.plist.template > ~/Library/LaunchAgents/com.bhelx.capshare.plist
```

Edit these fields in that file:

```xml
    <key>ProgramArguments</key>
    <array>
      <string>/usr/local/bin/capshare</string>
      <string>{{absolute_path_to_capshare_folder}}</string>
      <string>{{bucket_name}}</string>
      <string>{{s3_access_id}}</string>
      <string>{{s3_secret}}</string>
    </array>
```
Now to launch the daemon

```bash
launchctl load ~/Library/LaunchAgents/com.bhelx.capshare.plist
```

If you need to stop it at any point you can do so with unload

```bash
launchctl unload ~/Library/LaunchAgents/com.bhelx.capshare.plist
```

### Linux(systemd)

Linux support only exists right now for systemd users. You'll also need to ensure your system is setup to have a user instance of system running.

First, download and edit the capshare.service file:

```bash
curl https://raw.github.com/bhelx/capshare/master/config/linux/capshare.service > ~/.config/systemd/user/capshare.service
```

Edit these fields in that file:

```xml
    <key>ProgramArguments</key>
    <array>
      <string>/usr/local/bin/capshare</string>
      <string>{{absolute_path_to_capshare_folder}}</string>
      <string>{{bucket_name}}</string>
      <string>{{s3_access_id}}</string>
      <string>{{s3_secret}}</string>
    </array>
```

Use systemctl to start capshare

```bash
systemctl --user start capshare
```

You can stop is as needed

```bash
systemctl --user stop capshare
```

## Final Steps

You might want to ensure the capshare binary is where I think it is with:

```bash
which capshare
```

You also may want to consider creating a user in s3 for specifically accessing your bucket so it will be easy to revoke.

## Done

Now if you take a screencap you will almost immediately have an https link in your copy buffer so you can paste to whoever you need to share with.

## TODO

* support other linux init systems
* more content types
* better installation process
* error handling
* integrate with os x notifications or growl


