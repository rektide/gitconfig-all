#!/usr/bin/env node
"use strict"

var
  opt= require( "./opt"),
  pAllGood= require( "p-all-good"),
  source= require( "./source")

/**
 * Find all valid gitconfig files
 */
function find( options){
	var candidates= opt( "candidates", options, this, module.exports.defaults)
	candidates= candidates.map( c=> c.call( this, options))
	return pAllGood( candidates)
}

function main(){
	find().then( files=> files.forEach( f=> console.log( f)), function( err){
		console.error("Failed to find gitconfigs", err)
		process.exit(1)
	})
}

module.exports= find
module.exports.find= find
module.exports.main= main
module.exports.defaults= {
	candidates: [
		source.system,
		source.xdg,
		source.home,
		source.repo
	]
}

if( require.main === module){
	module.exports.main()
}
