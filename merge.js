"use strict"

function merge( arr){
	arr.unshift({})
	return Object.assign.apply(null, arr)
}

module.exports= merge
module.exports.merge= merge
