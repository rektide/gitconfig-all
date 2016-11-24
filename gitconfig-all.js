var
  fs= require( "fs"),
  ini= require( "ini"),
  merge= require("lodash.merge"),
  PMap= require( "p-map"),
  source= require( "./source")


function _pmap( mapper, options){
	return function( input){
		return PMap( input, mapper, options)
	}
}

function _readFile( file){
	return new Promise( function( resolve, reject){
		fs.readFile( file, "utf8", function( err, file){
			if( err){
				reject(err)
			}
			resolve( file)
		})
	})
}

function _arrayitize( content){
	return Promise.resolve( content).then(function( content){
		if( content.length=== undefined){
			return [ content]
		}
		return content
	})
}

function _arrayMerge( contents){
	Promise.resolve( contents).then( function( contents){
		var output= Array.prototype.concat.apply([], contents)
		return output
	})
}

/**
 * Get all pertinent gitignore filepaths
 * @param [dir] - optional directory or directories to search from, or `process.cwd`.
 * @returns a promise of an array of discovered gitignore files
 */
function find( dir){
	return _arrayitize( dir)
		.then( _pMap( source.found))
		.then( _arrayMerge)
}

/**
 * Read file or files
 * @param found - found file or files to read in
 * @returns a promise of an array of file contents in utf8
 */
function read( found){
	return _arrayitize( found)
		.then( _pMap( _readFile))
}

/**
 * Turn gitignore text or texts into parsed objects.
 * @param content - the text or texts of gitignore files
 * @returns a promise of an array of parsed objects
 */
function parse( content){
	return _arrayitize( content)
		.then( _pmap( function( content){
			return format(ini.parse( content))
		}))
}

/**
 * Combine parsed object or objects
 * @param bodies - object or objects to merge together
 * @returns - a promise of a merged parsed object
 */
function merge( objects){
	return _arrayitize( objects)
		.then( function( content){
			content.unshift({})
			var output= Object.assign.apply(Object, content)
			return output
		})
}


function gitconfigAll(){
	var
	  found= find(),
	  texts= read( found),
	  parsed= parse( texts),
	  result= merge( parsed)
	return result	 
}
