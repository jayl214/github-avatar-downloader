var request = require( 'request' );
var fs = require( 'fs' );
var args = process.argv.slice(2);

var GITHUB_USER = "jayl214";
var GITHUB_TOKEN = "e1151f5070c807e6ea8ad019dccb2a812b90c2ea";

console.log( 'Welcome to the GitHub Avatar Downloader!' );
if ( args.length !== 2 ){
  throw new Error( 'need 2 args' );
};


function downloadImageByURL( url, filePath ){
  request.get( url )
  //Downloader function that runs for every image we want to download.
         .on( 'error', function(err) {
            console.log( 'Error while downloading Image:', err )
            return; //if error occurs, log and end function
         })
         .on( 'end', function() {
            console.log( 'Image downloaded' ) //logs each time an image is successfully downloaded
         })
         .pipe( fs.createWriteStream( filePath ) ); //stores image file in specified folder
};

function getRepoContributors( repoOwner, repoName, cb ){
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';

  request( { url: requestURL, headers: { 'User-Agent': 'GitHub Avatar Downloader - Student Project' } }, function( error, response, body ){
    //targets the contributors API of a given repo (specified by owner and name of the repo)
    if( error ){
      cb( error );
      return;
    }; //if error occurs, log error and end function
    var bodyOBJ = JSON.parse( body ) //turn JSON into object array

    for ( i in bodyOBJ ) {
      cb( error, bodyOBJ[i].avatar_url );
      downloadImageByURL( bodyOBJ[i].avatar_url, `avatars/${bodyOBJ[i].login}.jpg` )
      //for each contributor, extract URL and specify target folder for downloader function
    };
  });

};


getRepoContributors( args[0], args[1], function( err, result ) {

  if (err){
    console.log( 'ERROR:', err );
  }
  else{
    console.log( 'Avatar URL:', result );
  } //if error occurs, log the error. Otherwise, log avatar URL.
});

