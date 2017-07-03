var request = require('request');


console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  request({url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`, headers: {'User-Agent': 'GitHub Avatar Downloader - Student Project'} }, function(error, response, body){
  if(error) cb(error);
  var bodyOBJ = JSON.parse(body)
  for (i in bodyOBJ) cb(error, bodyOBJ[i].avatar_url );
  });

}


getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});
