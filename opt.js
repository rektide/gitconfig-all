"use strict"

var multipick= require( "multipick")

/**
 * Lookup a field from local options, local context, fallback to defaults
 * @internal
 */
function opt( field, options, self, defaults){
	// find value
	var value= multipick( field, options, self, defaults)

	// lookup value if it is a function
	if( value && typeof( value)=== "function"){
		value= value.call( self, options)
	}

	return value
}

module.exports= opt
module.exports.opt= opt
