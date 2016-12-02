"use strict"

var fs= require( "fs")

function read( filename){
	return new Promise( function( resolve, reject){
		fs.readFile( filename, "utf8", function( err, file){
			if( err){
				reject( err)
			}else{
				resolve( file)
			}
		})
	})
}

module.exports= read
module.exports.read= read
