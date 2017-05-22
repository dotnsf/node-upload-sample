//. app.js

var express = require( 'express' ),
    cfenv = require( 'cfenv' ),
    multer = require( 'multer' ),
    fs = require( 'fs' ),
    app = express(),
    appEnv = cfenv.getAppEnv();

var crypto = require( 'crypto' );

app.use( multer( { dest: './uploads/' } ).single( 'img' ) );
app.use( express.static( __dirname + '/public' ) );

app.post( '/upload', function( req, res ){
  //console.log( req.file );
  var originalname = req.file.originalname; //. 'xxxx.png'

  var n = originalname.lastIndexOf( '.' );
  var ext = originalname.substring( n );    //. '.png'

  var path = req.file.path;
  var destination = req.file.destination;

  //. Name after Hash value
  var hash = crypto.createHash( 'sha512' );
  var fstream = fs.createReadStream( path );
  hash.setEncoding( 'hex' );
  fstream.on( 'end', function(){
    hash.end();
    var result = hash.read();

    fs.createReadStream( path )
      .pipe( fs.createWriteStream( './images/' + result + ext ) );

    fs.unlink( path, function( err ){} );

    res.redirect( './' );
  });

  fstream.pipe( hash );
});

app.listen( appEnv.port );
console.log( "server starting on " + appEnv.port + " ..." );



