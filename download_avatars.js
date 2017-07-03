require('dotenv').config()
var request = require( 'request' );
var fs = require( 'fs' );
var args = process.argv.slice(2);

var GITHUB_USER = process.env.GITHUB_USER;
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;


console.log( 'Welcome to the GitHub Avatar Downloader!' );


if ( args.length !== 2 ){
  throw new Error( 'need 2 args' );
}; //throw error if did not input owner and/or repo name
if ( !fs.existsSync( './.env' ) ){
  throw new Error( 'dotenv file does not exist!' )
}; //throw error if .env file doesn't exist
if ( GITHUB_USER == undefined || GITHUB_TOKEN == undefined ){
  throw new Error( 'Github username or token missing from .env file!' );
}; //throw error if missing github credentials
if ( !fs.existsSync( './avatars' ) ){
  fs.mkdirSync('./avatars');
}; //create avatars folder if none existed


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
      throw new Error ( error );
    }; //if error occurs, log error and end function
    var bodyOBJ = JSON.parse( body ) //turn JSON into object array

    for ( i in bodyOBJ ) {
      if ( response.statusCode === 401 ) throw new Error ('401: invalid credentials!');
      //if getting 401 error, log invalid credentials
      if(bodyOBJ[i].avatar_url == undefined){
        throw new Error ( 'the provided owner/repo is invalid' );
      }; //if cannot retreive a value for avatar URL at target repo, log invalid owner/repo
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
  } //if any unhandled error occurs, log the error. Otherwise, log avatar URL.
});

