var request = require('request');
var secrets = require('./secrets.js');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');
var repoOwner = process.argv[2]
var repoName = process.argv[3]
// function to get user info
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'Token ' + secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });
}

getRepoContributors(repoOwner, repoName, function(err, result) {
  var data = JSON.parse(result);

  data.forEach (function(item){
    downloadImageByURL(item.avatar_url, './avatars/' + item.login + '.jpg')
  });
  console.log("Errors:", err);
});

// function to download URL
function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function(err){
    throw err;
  })
  .on('response', function(response){
    console.log('Downloading image...');
    console.log('Response Messages ------------ ', response.statusMessage);
    console.log('Status Type ---------- ', response.headers['content-type'])
    console.log('Download complete.'); 
  })
  .pipe(fs.createWriteStream(filePath));
}