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
    for (let page = 2; page < totalPages; page++)
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

function retrieveProfile(config)
{
    // Set request URL
    var url = `${apiUrl}&method=user.getInfo&` +
        `user=${config.username}&api_key=${config.api_key}`;

    var profileData = common.prettyPrintJsonStr(getData(url));

    // Save to backup folder
    common.updateOrCreateFile(config.backupDir, config.username + ".json", profileData);
}

function retrieveFriends(config)
{
    // Set request URL
    var url = `${apiUrl}&method=user.getFriends&limit=200&` +
        `user=${config.username}&api_key=${config.api_key}`;

    var friendsData = common.prettyPrintJsonStr(getData(url, true));

    // Fold array of responses into single structure
    // friendsData = collateArrays("friends.user", friendsData);

    // Save to backup folder
    common.updateOrCreateFile(config.backupDir, "friends.json", friendsData);
}

function retrieveLovedTracks(config)
{
    // Set request URL
    var url = `${apiUrl}&method=user.getLovedTracks&limit=200&` +
        `user=${config.username}&api_key=${config.api_key}`;

    var lovedTracksData = common.prettyPrintJsonStr(getData(url, true));

    // Fold array of responses into single structure
    lovedTracksData = collateArrays("lovedtracks.track", lovedTracksData);

    // TODO Parse track data into a more useful format

    // Save to backup folder
    common.updateOrCreateFile(config.backupDir, "lovedTracks.json", lovedTracksData);
}

function retrieveTopTracks(config)
{
    // Set request URL
    var url = `${apiUrl}&method=user.getTopTracks&period=overall&limit=200&` +
        `user=${config.username}&api_key=${config.api_key}`;

    var topTracksData = common.prettyPrintJsonStr(getData(url));

    // TODO Parse track data into a more useful format

    // Save to backup folder
    common.updateOrCreateFile(config.backupDir, "topTracks.json", topTracksData);
}

function retrieveTopArtists(config)
{
    // Set request URL
    var url = `${apiUrl}&method=user.getTopArtists&period=overall&limit=200&` +
        `user=${config.username}&api_key=${config.api_key}`;

    var topArtistsData = common.prettyPrintJsonStr(getData(url));

    // TODO Parse artist data into a more useful format

    // Save to backup folder
    common.updateOrCreateFile(config.backupDir, "topArtists.json", topArtistsData);
}

function retrieveTopAlbums(config)
{
    // Set request URL
    var url = `${apiUrl}&method=user.getTopAlbums&period=overall&limit=200&` +
        `user=${config.username}&api_key=${config.api_key}`;

    var topAlbumsData = common.prettyPrintJsonStr(getData(url));

    // TODO Parse album data into a more useful format

    // Save to backup folder
    common.updateOrCreateFile(config.backupDir, "topAlbums.json", topAlbumsData);
}

function retrieveTopTags(config)
{
    // Set request URL
    var url = `${apiUrl}&method=user.getTopTags&limit=200&` +
        `user=${config.username}&api_key=${config.api_key}`;

    var topTagsData = common.prettyPrintJsonStr(getData(url));

    // Save to backup folder
    common.updateOrCreateFile(config.backupDir, "topTags.json", topTagsData);
}

function retrieveScrobbles(config)
{
    // Setup request URL
    var url = `${apiUrl}&method=user.getRecentTracks&limit=200&` +
        `user=${config.username}&api_key=${config.api_key}`;


    var scrobblesData = common.prettyPrintJsonStr(getData(url, true));

    // Fold array of responses into single structure
    scrobblesData = collateArrays("recenttracks.track", collateArrays);

    // TODO Parse track data into a more useful format

    // Save to backup folder
    common.updateOrCreateFile(config.backupDir, "scrobbles.json", scrobblesData);
}

function main()
{
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
    // retrieveScrobbles(config);
}