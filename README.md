# Last.fm Backup Script

*Export Last.fm user data, using Google Apps Script.*

This script can be used to automatically export user data and "all-time" stats
from Last.fm. This includes top tracks, artists, albums & tags, loved tracks,
and full scrobble history. They are stored in a specified Google Drive
directory, where they can be easily downloaded or shared.

## Usage

This script is designed to be run on-demand via the GAS interface, or
periodically via GAS triggers. For more info on setting up GAS triggers, see
[this Google Apps Script guide](https://developers.google.com/apps-script/guides/triggers).

The script includes a function to export each data type, such as
`retrieveLovedTracks()`, which can be run directly. It also includes a few
functions that run related exports together, such as `getFaves()`, which will
export all the top data, along with loved tracks. To export all user data at
once, simply run the `main()` function.

## Setup

There are two basic steps necessary to run this script.

1. [Customize your config file](#1.-Customize-your-config-file)
2. [Load the script into a new Google Apps Script project](#2.-Load-the-script-into-a-new-Google-Apps-Script-project)

### 1. Customize your config file

`config.js` should contain a single JavaScript object, used to specify all
necessary configuration information. Here's where you specify the user, your
API key, the desired output format(s), as well as the Google Drive directory
to save the exported files to.

An example version is provided, named `example.config.js`, which can be
renamed or copied to `config.js` before loading into the GAS project.

The basic structure can be seen below.

```js
const config = {
    "username": "<Last.fm username>",
    "apiKey": "<Last.fm API key>",
    "outputFormat": ["rawJson", "json"],
    "backupDir": "<Google Drive directory ID>"
};
```

- `username`: Name of the Last.fm user whose data you want to export.
- `apiKey`: A key for accessing the [Last.fm API](http://www.last.fm/api/account/create).
- `outputFormat`: An array indicating the desired output format(s).
    Valid values are:
    * `rawJson` - JSON data, direct from the Last.fm API, containing all
        fields.
    * `json` - JSON data, filtered to contain only essential fields.
- `backupDir`: The ID of the Google Drive directory, where exported maps
    should be stored. This can be found by navigating to the folder, and
    grabbing the ID from the tail of the URL.

### 2. Load the script into a new Google Apps Script project

You can manually load the script into a
[new GAS project](https://www.google.com/script/start/),
by simply copying and pasting it into the editor.

Or you can use a
[tool like clasp](https://developers.google.com/apps-script/guides/clasp)
to upload it directly. For more information on using clasp, here is a
[guide I found useful](https://github.com/gscharf94/Clasp-Basics-for-Reddit).

## Credits

- Inspired by [iiiypuk/lastfm-backup](https://github.com/iiiypuk/lastfm-backup).