const apiUrl = "https://ws.audioscrobbler.com/2.0/?format=json";

function getData(url, getAllPages = false)
{
    var options = {
        "muteHttpExceptions": true
    };
    var data = [UrlFetchApp.fetch(url, options).getContentText()];

    // Bail out if we only wanted the first page
    if (!getAllPages)
    {
        return data[0];
    }

    // Retrieve page count, if instructed
    var pageObj = Object.values(JSON.parse(data[0]));
    var totalPages = pageObj[0]["@attr"]["totalPages"];
    for (let page = 2; page <= totalPages; page++)
    {
        var pageUrl = url + `&page=${page}`;
        data.push(UrlFetchApp.fetch(pageUrl, options).getContentText());
    }

    return data;
}

////////////////////////////////////////////////////

function retrieveProfile()
{
    // Set request URL
    var url = `${apiUrl}&method=user.getInfo&` +
        `user=${config.username}&api_key=${config.apiKey}`;

    // Request the data, and extract the values
    var data = getData(url);
    data = JSON.parse(data).user;

    // Save raw/JSON data to backup folder
    if (config.outputFormat.includes("rawJson") ||
        config.outputFormat.includes("json"))
    {
        common.updateOrCreateJsonFile(config.backupDir,
            config.username + ".json", data);
    }

    // Save CSV data to backup folder
    // if (config.outputFormat.includes("csv"))
    // {
    //     var profileData = toCSV(data);
    //     common.updateOrCreateFile(config.backupDir, config.username + ".csv", profileData);
    // }
}

function retrieveFriends()
{
    // Set request URL
    var url = `${apiUrl}&method=user.getFriends&limit=200&` +
        `user=${config.username}&api_key=${config.apiKey}`;

    // Request the data, and extract the values
    var data = getData(url, true);

    // Fold array of responses into single structure
    data = common.collateArrays("friends.user", data);

    // Save raw/JSON data to backup folder
    if (config.outputFormat.includes("rawJson") ||
        config.outputFormat.includes("json"))
    {
        common.updateOrCreateJsonFile(config.backupDir, "friends.json", data);
    }
}

function retrieveLovedTracks()
{
    // Set request URL
    var url = `${apiUrl}&method=user.getLovedTracks&limit=2&` +
        `user=${config.username}&api_key=${config.apiKey}`;

    // Request the data, and extract the values
    var data = getData(url, true);

    // Fold array of responses into single structure
    data = common.collateArrays("lovedtracks.track", data);

    // Save raw data to backup folder
    if (config.outputFormat.includes("rawJson"))
    {
        common.updateOrCreateJsonFile(config.backupDir, "lovedTracks.raw.json",
            data);
    }

    if (config.outputFormat.includes("json"))
    {
        // Parse track data into a more useful format
        var filteredData = data.map(function(track)
        {
            return {
                date: track.date.uts,
                track: track.name,
                artist: track.artist.name,
            };
        });

        // Save to backup folder
        common.updateOrCreateJsonFile(config.backupDir, "lovedTracks.json",
            filteredData);
    }
}

function retrieveTopTracks()
{
    // Set request URL
    var url = `${apiUrl}&method=user.getTopTracks&period=overall&limit=200&` +
        `user=${config.username}&api_key=${config.apiKey}`;

    // Request the data, and extract the values
    var data = getData(url);

    // Save raw data to backup folder
    if (config.outputFormat.includes("rawJson"))
    {
        common.updateOrCreateJsonFile(config.backupDir, "topTracks.raw.json",
            data);
    }

    if (config.outputFormat.includes("json"))
    {
        // Parse track data into a more useful format
        var filteredData = JSON.parse(data).toptracks.track.map(function(track)
        {
            return {
                track: track.name,
                artist: track.artist.name,
                playcount: track.playcount,
            };
        });

        // Save to backup folder
        common.updateOrCreateJsonFile(config.backupDir, "topTracks.json",
            filteredData);
    }
}

function retrieveTopArtists()
{
    // Set request URL
    var url = `${apiUrl}&method=user.getTopArtists&period=overall&limit=200&` +
        `user=${config.username}&api_key=${config.apiKey}`;

    // Request the data, and extract the values
    var data = getData(url);

    // Save raw data to backup folder
    if (config.outputFormat.includes("rawJson"))
    {
        common.updateOrCreateJsonFile(config.backupDir, "topArtists.raw.json",
            data);
    }

    if (config.outputFormat.includes("json"))
    {
        // Parse track data into a more useful format
        var filteredData = JSON.parse(data).topartists.artist.map(function(artist)
        {
            return {
                artist: artist.name,
                playcount: artist.playcount,
            };
        });

        // Save to backup folder
        common.updateOrCreateJsonFile(config.backupDir, "topArtists.json",
            filteredData);
    }
}

function retrieveTopAlbums()
{
    // Set request URL
    var url = `${apiUrl}&method=user.getTopAlbums&period=overall&limit=200&` +
        `user=${config.username}&api_key=${config.apiKey}`;

    // Request the data, and extract the values
    var data = getData(url);

    // Save raw data to backup folder
    if (config.outputFormat.includes("rawJson"))
    {
        common.updateOrCreateJsonFile(config.backupDir, "topAlbums.raw.json",
            data);
    }

    if (config.outputFormat.includes("json"))
    {
        // Parse track data into a more useful format
        var filteredData = JSON.parse(data).topalbums.album.map(function(album)
        {
            return {
                album: album.name,
                artist: album.artist.name,
                playcount: album.playcount,
            };
        });

        // Save to backup folder
        common.updateOrCreateJsonFile(config.backupDir, "topAlbums.json",
            filteredData);
    }
}

function retrieveTopTags()
{
    // Set request URL
    var url = `${apiUrl}&method=user.getTopTags&limit=200&` +
        `user=${config.username}&api_key=${config.apiKey}`;

    // Request the data, and extract the values
    var data = getData(url);

    // Save raw data to backup folder
    if (config.outputFormat.includes("rawJson"))
    {
        common.updateOrCreateJsonFile(config.backupDir, "topTags.raw.json",
            data);
    }

    if (config.outputFormat.includes("json"))
    {
        // Parse track data into a more useful format
        var filteredData = JSON.parse(data).toptags.tag.map(function(tag)
        {
            return {
                tag: tag.name,
                count: tag.count,
            };
        });

        // Save to backup folder
        common.updateOrCreateJsonFile(config.backupDir, "topTags.json",
            filteredData);
    }
}

function retrieveScrobbles()
{
    // Setup request URL
    var url = `${apiUrl}&method=user.getRecentTracks&limit=200&` +
        `user=${config.username}&api_key=${config.apiKey}`;


    // Request the data, and extract the values
    var data = getData(url, true);

    // Fold array of responses into single structure
    data = common.collateArrays("recenttracks.track", data);

    // Save raw data to backup folder
    if (config.outputFormat.includes("rawJson"))
    {
        common.updateOrCreateJsonFile(config.backupDir, "scrobbles.raw.json",
            data);
    }

    if (config.outputFormat.includes("json"))
    {
        // Parse track data into a more useful format
        var filteredData = data.map(function(track)
        {
            var date;
            // Tracks that are currently playing don't have a date,
            // so we just have to grab a timestamp for now
            if (track["date"] == undefined &&
                track["@attr"] !== undefined && track["@attr"]["nowplaying"])
            {
                date = Math.floor(Date.now() / 1000).toString();
            }
            else
            {
                date = track.date.uts;
            }

            return {
                date: date,
                track: track.name,
                artist: track.artist["#text"],
                album: track.album["#text"],
            };
        });

        // Save to backup folder
        common.updateOrCreateJsonFile(config.backupDir, "scrobbles.json",
            filteredData);
    }
}

function getPersonalInfo()
{
    // Retrieve profile info
    retrieveProfile();

    // Retrieve friends
    retrieveFriends();
}

function getFaves()
{
    // Retrieve top 200 tracks/artists/albums/tags
    retrieveTopTracks();
    retrieveTopArtists();
    retrieveTopAlbums();
    retrieveTopTags();

    // Retrieve loved tracks
    retrieveLovedTracks();
}

function main()
{
    // Don't do anything if there's no output formats
    if (config.outputFormat.length < 1)
    {
        return;
    }

    getPersonalInfo();
    getFaves();

    // Retrieve all scrobbles
    retrieveScrobbles();
}