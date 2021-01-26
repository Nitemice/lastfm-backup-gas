const apiUrl = "https://ws.audioscrobbler.com/2.0/?format=json";

function getData(url, getAllPages = false)
{
    // Retrieve page count, if instructed
    var totalPages = 1;
    if (getAllPages)
    {
        var initialData = JSON.parse(UrlFetchApp.fetch(url).getContentText());
        totalPages = initialData[0]["@attr"]["totalPages"];
    }

    var options = {
        "muteHttpExceptions": true
    };
    var response = UrlFetchApp.fetch(url, options);
    return response.getContentText();
}

function retrieveScrobbles(config)
{
    // Setup request URL
    var url = `${apiUrl}&method=user.getRecentTracks&limit=200&` +
        `user=${config.username}&api_key=${config.api_key}`;

    // Request pages until we run out of pages 
    var page = 1;
    do
    {

    } while (page < totalPages);
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
    var url = `${apiUrl}&method=user.getFriends&` +
        `user=${config.username}&api_key=${config.api_key}`;

    var friendsData = common.prettyPrintJsonStr(getData(url));

    // Save to backup folder
    common.updateOrCreateFile(config.backupDir, "friends.json", friendsData);
}

function main()
{
    // Retrieve profile info
    retrieveProfile(config);

    // Retrieve friends
    retrieveFriends(config);

    // Retrieve loved tracks
    // Retrieve top 100 tracks/artists/albums
    // Retrieve all scrobbles

}