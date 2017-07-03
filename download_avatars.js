var request = require('request');
var fs = require('fs');


console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  request({url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`, headers: {'User-Agent': 'GitHub Avatar Downloader - Student Project'} }, function(error, response, body){
    if(error) cb(error);
    var bodyOBJ = JSON.parse(body)
    for (i in bodyOBJ) {
      cb(error, bodyOBJ[i].avatar_url );
      downloadImageByURL(bodyOBJ[i].avatar_url, `avatars/${i}.jpg`)
    }
  });

}


function downloadImageByURL(url, filePath) {
  request.get(url)
         .on('error', function(err){
            console.log('error:',err)
         })
         .on('end', function(){
            console.log('Download complete!')
         })
         .pipe(fs.createWriteStream(filePath));


}


getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")