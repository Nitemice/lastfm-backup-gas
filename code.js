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

function collateArrays(path, objects)
{
    var outArray = [];
    var chunks = path.split('.');

    // Iterate over each object
    for (const resp of objects)
    {
        var obj = JSON.parse(resp);
        for (const chunk of chunks)
        {
            obj = obj[chunk];
        }
        outArray = outArray.concat(obj);
    }

    return outArray;
}

////////////////////////////////////////////////////

function retrieveProfile(config)
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
        var profileData = JSON.stringify(data, null, 4);
        common.updateOrCreateFile(config.backupDir, config.username + ".json", profileData);
    }
}

function retrieveFriends(config)
{
    // Set request URL
    var url = `${apiUrl}&method=user.getFriends&limit=200&` +
        `user=${config.username}&api_key=${config.apiKey}`;

    // Request the data, and extract the values
    var data = getData(url, true);

    // Fold array of responses into single structure
    data = collateArrays("friends.user", data);

    // Save raw/JSON data to backup folder
    if (config.outputFormat.includes("rawJson") ||
        config.outputFormat.includes("json"))
    {
        var friendsData = JSON.stringify(data, null, 4);
        common.updateOrCreateFile(config.backupDir, "friends.json", friendsData);
    }
}

function retrieveLovedTracks(config)
{
    // Set request URL
    var url = `${apiUrl}&method=user.getLovedTracks&limit=2&` +
        `user=${config.username}&api_key=${config.apiKey}`;

    // Request the data, and extract the values
    var data = getData(url, true);

    // Fold array of responses into single structure
    data = collateArrays("lovedtracks.track", data);

    // Save raw data to backup folder
    if (config.outputFormat.includes("rawJson"))
    {
        var rawData = JSON.stringify(data, null, 4);
        common.updateOrCreateFile(config.backupDir, "lovedTracks.raw.json", rawData);
    }

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
    if (config.outputFormat.includes("json"))
    {
        var prettyData = JSON.stringify(filteredData, null, 4);
        common.updateOrCreateFile(config.backupDir, "lovedTracks.json", prettyData);
    }
}

function retrieveTopTracks(config)
{
    // Set request URL
    var url = `${apiUrl}&method=user.getTopTracks&period=overall&limit=200&` +
        `user=${config.username}&api_key=${config.apiKey}`;

    // Request the data, and extract the values
    var data = getData(url);

    // Save raw data to backup folder
    if (config.outputFormat.includes("rawJson"))
    {
        var rawData = common.prettyPrintJsonStr(data);
        common.updateOrCreateFile(config.backupDir, "topTracks.raw.json", rawData);
    }

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
    if (config.outputFormat.includes("json"))
    {
        var prettyData = JSON.stringify(filteredData, null, 4);
        common.updateOrCreateFile(config.backupDir, "topTracks.json", prettyData);
    }
}

function retrieveTopArtists(config)
{
    // Set request URL
    var url = `${apiUrl}&method=user.getTopArtists&period=overall&limit=200&` +
        `user=${config.username}&api_key=${config.apiKey}`;

    // Request the data, and extract the values
    var data = getData(url);

    // Save raw data to backup folder
    if (config.outputFormat.includes("rawJson"))
    {
        var rawData = common.prettyPrintJsonStr(data);
        common.updateOrCreateFile(config.backupDir, "topArtists.raw.json", rawData);
    }

    // Parse track data into a more useful format
    var filteredData = JSON.parse(data).topartists.artist.map(function(artist)
    {
        return {
            artist: artist.name,
            playcount: artist.playcount,
        };
    });

    // Save to backup folder
    if (config.outputFormat.includes("json"))
    {
        var prettyData = JSON.stringify(filteredData, null, 4);
        common.updateOrCreateFile(config.backupDir, "topArtists.json", prettyData);
    }
}

function retrieveTopAlbums(config)
{
    // Set request URL
    var url = `${apiUrl}&method=user.getTopAlbums&period=overall&limit=200&` +
        `user=${config.username}&api_key=${config.apiKey}`;

    // Request the data, and extract the values
    var data = getData(url);

    // Save raw data to backup folder
    if (config.outputFormat.includes("rawJson"))
    {
        var rawData = common.prettyPrintJsonStr(data);
        common.updateOrCreateFile(config.backupDir, "topAlbums.raw.json", rawData);
    }

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
    if (config.outputFormat.includes("json"))
    {
        var prettyData = JSON.stringify(filteredData, null, 4);
        common.updateOrCreateFile(config.backupDir, "topAlbums.json", prettyData);
    }
}

function retrieveTopTags(config)
{
    // Set request URL
    var url = `${apiUrl}&method=user.getTopTags&limit=200&` +
        `user=${config.username}&api_key=${config.apiKey}`;

    // Request the data, and extract the values
    var data = getData(url);

    // Save raw data to backup folder
    if (config.outputFormat.includes("rawJson"))
    {
        var rawData = common.prettyPrintJsonStr(data);
        common.updateOrCreateFile(config.backupDir, "topTags.raw.json", rawData);
    }

    // Parse track data into a more useful format
    var filteredData = JSON.parse(data).toptags.tag.map(function(tag)
    {
        return {
            tag: tag.name,
            count: tag.count,
        };
    });

    // Save to backup folder
    if (config.outputFormat.includes("json"))
    {
        var prettyData = JSON.stringify(filteredData, null, 4);
        common.updateOrCreateFile(config.backupDir, "topTags.json", prettyData);
    }
}

function retrieveScrobbles(config)
{
    // Setup request URL
    var url = `${apiUrl}&method=user.getRecentTracks&limit=200&` +
        `user=${config.username}&api_key=${config.apiKey}`;


    // Request the data, and extract the values
    var data = getData(url, true);

    // Fold array of responses into single structure
    data = collateArrays("recenttracks.track", data);

    // Save raw data to backup folder
    if (config.outputFormat.includes("rawJson"))
    {
        var rawData = JSON.stringify(data, null, 4);
        common.updateOrCreateFile(config.backupDir, "scrobbles.raw.json", rawData);
    }

    // Parse track data into a more useful format
    var filteredData = data.map(function(track)
    {
        return {
            date: track.date.uts,
            track: track.name,
            artist: track.artist["#text"],
            album: track.album["#text"],
        };
    });

    // Save to backup folder
    if (config.outputFormat.includes("json"))
    {
        var prettyData = JSON.stringify(filteredData, null, 4);
        common.updateOrCreateFile(config.backupDir, "scrobbles.json", prettyData);
    }
}

function main()
{
    // Don't do anything if there's no output formats
    if (config.outputFormat.length < 1)
    {
        return;
    }

    // Retrieve profile info
    retrieveProfile(config);

    // Retrieve friends
    retrieveFriends(config);

    // Retrieve loved tracks
    retrieveLovedTracks(config);

    // Retrieve top 200 tracks/artists/albums/tags
    retrieveTopTracks(config);
    retrieveTopArtists(config);
    retrieveTopAlbums(config);
    retrieveTopTags(config);

    // Retrieve all scrobbles
    retrieveScrobbles(config);
}