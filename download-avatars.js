var request = require('request');
var secrets = require('./secrets.js');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

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

getRepoContributors("jquery", "jquery", function(err, result) {
  var data = JSON.parse(result);
  data.forEach (function(item){
    console.log(item.avatar_url);
  });
  console.log("Errors:", err);
  // console.log("Result:", result)
  // commented out as specific results are now printed
});

// function to download URL
function downloadImageByURL(url, filePath) {
  request.get("https://avatars2.githubusercontent.com/u/2741?v=3&s=466")
  .on('error', function(err){
    throw err;
  })
  .on('response', function(response){
    console.log('Downloading image...');
    console.log('Response Messages ------------ ', response.statusMessage);
    console.log('Status Type ---------- ', response.headers['content-type'])
    console.log('Download complete.'); 
  })
  .pipe(fs.createWriteStream('./' + 'avatars/kvirani.jpg'));
}

downloadImageByURL();