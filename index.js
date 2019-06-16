const express = require('express'),
	chalk = require('chalk'),
	fs = require( 'fs' ),
	path = require('path'),
	args = require('yargs').argv;

const pkg = require( './package.json' );

const start = Date.now(),
	protocol = args.protocol || 'https',
	port = args.port || '3000',
	host = args.host || 'localhost';

let server;

function sendBootStatus( status ) {
	 // don't send anything if we're not running in a fork
	if ( ! process.send ) {
	return;
	}
	process.send( { boot: status } );
}

const app = express();

app.use(express.static('./'))

app.get('/', (request, response) => {
	response.sendFile(path.join(__dirname + "/gyro-test.html"))
});

app.get( '/version', function( request, response ) {
	 response.json( {
	  version: pkg.version
	 } );
} );

console.log(
	chalk.yellow( '%s booted in %dms - %s://%s:%s' ),
	pkg.name,
	Date.now() - start,
	protocol,
	host,
	port
);

// Start a development HTTPS server.
if ( protocol === 'https' ) {
	const { execSync } = require( 'child_process' );
	const execOptions = { encoding: 'utf-8', windowsHide: true };
	let key = './certs/key.pem';
	let certificate = './certs/certificate.pem';

	// Here is where the certificate is generated
	if ( ! fs.existsSync( key ) || ! fs.existsSync( certificate ) ) {
		try {
			execSync( 'openssl version', execOptions );
			execSync(
				`openssl req -x509 -newkey rsa:2048 -keyout ./certs/key.tmp.pem -out ${ certificate } -days 365 -nodes -subj "/C=US/ST=Foo/L=Bar/O=Baz/CN=localhost"`,
				execOptions
			);
			execSync( `openssl rsa -in ./certs/key.tmp.pem -out ${ key }`, execOptions );
			if(process.platform === "win32"){
				execSync( 'REM ./certs/key.tmp.pem', execOptions );
			} else {
				execSync( 'rm ./certs/key.tmp.pem', execOptions );
			}
		} catch ( error ) {
			console.error( error );
		}
	}

	// Here is where the https server is created
	const options = {
		 key: fs.readFileSync( key ),
		 cert: fs.readFileSync( certificate ),
		 passphrase : 'password'
		};

	server = require( 'https' ).createServer( options, app );

} else {
	server = require( 'http' ).createServer( app );
}

server.listen( { port, host }, function() {
	// Tell the parent process that Server has booted.
	sendBootStatus( 'ready' );
} );