#!/usr/bin/env node
"use strict"

var
  access= require( "access-promise"),
  Findup= require( "findup"),
  os= require( "os"),
  path= require( "path"),
  promisify= require( "es6-promisify"),
  xdgBasedir= require("xdg-basedir")

var
  findup= promisify( Findup)

function system(){
	var prefix= this&& this.prefix|| module.exports.prefix
	if(!prefix){
		return "/etc/gitconfig"
	}
	return path.join( prefix, "/etc/gitconfig")
}

function xdg(){
	var xdg= this&& this.xdgBasedir|| module.exports.xdgBasedir
	if( !( xdg&& xdg.config)){
		throw new Error( "xdg expected an xdgBasedir.config")
	}
	return path.join( xdgBasedir.config, "git", "config")
}

function home(){
	var home= this&& this.homedir|| module.exports.homedir
	if( !home){
		throw new Error( "home expected a homedir factory")
	}
	home= home()
	return path.join( home, ".gitconfig")
}

function repo(){
	var
	  cwd= this&& this.cwd|| module.exports.cwd,
	  gitdir= this&& this.gitdir|| module.exports.gitdir
	cwd= cwd()
	return findup( cwd, gitdir).then( function( repo){
		var config= path.join( cwd, gitdir, "config")
		return config
	})
}

function all( fromDir){
	var
	  _all= this&& this._all|| module.exports._all,
	  values= _all.map( a=> a( fromDir))
	return Promise.all( values)
}

function exist( candidates){
	return access.filter.apply( null, candidates)
}

function found( fromDir){
	return all().then( function( e){
		return exist( e)
	})
}

module.exports.prefix= undefined // used by system
module.exports.xdgBasedir= xdgBasedir
module.exports.homedir= os.homedir // used by xdg and home
module.exports.gitdir= ".git" // used by repo
module.exports.cwd= process.cwd
module.exports._all= [system, xdg, home, repo]

module.exports.system= system
module.exports.xdg= xdg
module.exports.home= home
module.exports.repo= repo
module.exports.all= all
module.exports.exist= exist
module.exports.found= found

if( require.main=== module){
	found().then( x=> console.log( x.join( "\n")))
}
