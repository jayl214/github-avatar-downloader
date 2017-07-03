var request = require('request');
var fs = require('fs');
var args = process.argv.slice(2);


console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  request({url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`, headers: {'User-Agent': 'GitHub Avatar Downloader - Student Project'} }, function(error, response, body){
    if(error) cb(error);
    var bodyOBJ = JSON.parse(body)
    for (i in bodyOBJ) {
      cb(error, bodyOBJ[i].avatar_url );
      downloadImageByURL(bodyOBJ[i].avatar_url, `avatars/${bodyOBJ[i].login}.jpg`)
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


getRepoContributors( args[0], args[1], function(err, result) {
  console.log((args.length === 2  ? 'Errors: ' + err + '\nResult: ' + result : 'Please enter both the Owner and Name of the repo, in that order.'));
});

