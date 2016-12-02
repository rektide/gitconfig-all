"use strict"

var
  format= require( "./format"),
  ini= require( "ini")

function parse( content){
	var iniParsed= ini.parse( content)
	return format( iniParsed)
}

module.exports= parse
module.exports.parse= parse
