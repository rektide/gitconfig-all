#!/usr/bin/env node
"use strict"

var
  find= require( "./find"),
  format= require( "./format"),
  merge= require( "./merge"),
  parse= require( "./parse"),
  pMap= require( "p-map"),
  readFile= require( "./readFile")

process.on("unhandledRejection", console.error)

function gitconfigAll( options){
	var
	  found= find( options),
	  texts= found.then( a=> pMap( a, readFile)),
	  parsed= texts.then( a=> pMap( a, parse)),
	  merged= parsed.then( a=> merge(a))
	return merged
}

if( require.main=== module){
	gitconfigAll().then(JSON.stringify).then(console.log)
}

module.exports= gitconfigAll
module.exports.gitconfigAll= gitconfigAll
module.exports.find= find
module.exports.readFile= readFile
module.exports.parse= parse
module.exports.merge= merge
