var request = require('request');
var secrets = require('./secrets.js');
var fs = require('fs');

var repoOwner = process.argv[2];
var repoName = process.argv[3];

// function to get user info via GitHub
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

// function call as well as callback function code
getRepoContributors(repoOwner, repoName, function(err, result) {
  var data = JSON.parse(result);
  
  if (!repoOwner || !repoName) {
    throw err;
  };

  data.forEach (function(item){
    downloadImageByURL(item.avatar_url, './avatars/' + item.login + '.jpg');
  });
});

// function to download avatars and save them
// note I created an avatar folder via the command line to add the avatars
function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function(err){
    throw err;
  })
  .on('response', function(response){
    console.log('Downloading image...');
    console.log('Response Messages ------------ ', response.statusMessage);
    console.log('Status Type ---------- ', response.headers['content-type']);
    console.log('Download complete.'); 
  })
  .pipe(fs.createWriteStream(filePath));
};