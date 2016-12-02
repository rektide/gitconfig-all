#!/usr/bin/env node
"use strict"

var
  access= require( "access-promise"),
  Findup= require( "findup"),
  opt= require( "./opt"),
  os= require( "os"),
  path= require( "path"),
  promisify= require( "es6-promisify"),
  xdgBasedir= require("xdg-basedir")

var
  findup= promisify( Findup)

/**
 * Check and return system /etc/gitconfig
 */
function system( options){
	var prefix= opt( "prefix", options, this, module.exports.defaults)|| ""
	return access(path.join( path.sep, prefix, "etc", "gitconfig"))
}

/**
 * Check and return path for $XDG_CONFIG_DIR/git/config
 */
function xdg( options){
	var xdg= opt( "xdgBasedir", options, this, module.exports.defaults)
	if( !xdg|| !xdg.config){
		throw new Error( "xdg expected an xdgBasedir.config")
	}
	return access(path.join( xdg.config, "git", "config"))
}

/**
 * Check and return path for ~/.gitconfig
 */
function home( options){
	var homeDir= opt( "homeDir", options, this, module.exports.defaults)
	if( !homeDir){
		throw new Error( "home expected a homedir factory")
	}
	return access(path.join( homeDir, ".gitconfig"))
}

/**
 * Look up for .git directory, check & return config
 */
function repo( options){
	var
	  cwd= opt( "cwd", options, this, module.exports.defaults),
	  gitdir= opt( "gitdir", options, this, module.exports.defaults)
	if( !cwd){
		throw new Error("repo expected a cwd")
	}
	if( !gitdir){
		throw new Error("repo expected a gitdir")
	}
	return findup( cwd, gitdir).then( function( repo){
		var config= path.join( repo, gitdir, "config")
		return access(config)
	})
}

// exports
module.exports.system= system
module.exports.xdg= xdg
module.exports.home= home
module.exports.repo= repo

// defaults
module.exports.defaults= {
	prefix: undefined, // default git has no prefix
	xdgBasedir: xdgBasedir,
	homeDir: os.homedir, // used by xdg
	gitdir: ".git", // used by repo
	cwd: process.cwd
}
