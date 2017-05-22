//. app.js

var express = require( 'express' ),
    cfenv = require( 'cfenv' ),
    multer = require( 'multer' ),
    fs = require( 'fs' ),
    app = express(),
    appEnv = cfenv.getAppEnv();

app.use( multer( { dest: './uploads/' } ).single( 'img' ) );
app.use( express.static( __dirname + '/public' ) );

app.post( '/upload', function( req, res ){
  //console.log( req.file );
  var originalname = req.file.originalname; //. 'xxxx.png'

  var n = originalname.lastIndexOf( '.' );
  var ext = originalname.substring( n );    //. '.png'

  var path = req.file.path;
  var destination = req.file.destination;

  fs.createReadStream( path )
    .pipe( fs.createWriteStream( './images/' + originalname ) );


  fs.unlink( path, function( err ){} );

  res.redirect( './' );
});

app.listen( appEnv.port );
console.log( "server starting on " + appEnv.port + " ..." );



