//. app.js

var express = require( 'express' ),
    cfenv = require( 'cfenv' ),
    multer = require( 'multer' ),
    fs = require( 'fs' ),
    app = express(),
    appEnv = cfenv.getAppEnv();

var crypto = require( 'crypto' );

app.use( multer( { dest: './uploads/' } ).single( 'img' ) );
app.use( express.static( __dirname + '/images' ) );

app.get( '/', function( req, res ){
  var html = '<html>'
    + '<head>'
    + '<title>node-upload</title>'
    + '</head>'
    + '<body>'
    + '<form method="POST" action="./upload" enctype="multipart/form-data">'
    + '<input type="file" name="img"/><input type="submit" value="upload"/>'
    + '</form>'
    + '<hr/>'
    + '<ul>';

  var files = fs.readdirSync( './images/' );
  for( file in files ){
    var filename = files[file];
    if( filename != '.gitkeep' ){
      var li = '<li><a target="_blank" href="./' + filename + '">' + filename + '</a></li>';
      html += li;
    }
  }

  html += '</ul>'
    + '</body>'
    + '</html>';

  res.writeHead( 200, { 'Content-Type': 'text/html' } );
  res.end( html );
});

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



