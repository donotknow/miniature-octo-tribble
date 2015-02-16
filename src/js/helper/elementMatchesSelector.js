'use strict';


module.exports = function elementMatchesSelector( element, selector ) {

	if ( typeof element.matchesSelector === 'function' ) {
		return element.matchesSelector( selector );
	}

	var prefixes = [
		'moz',
		'ms',
		'o',
		'webkit'
	];

	for ( var i = 0; i < prefixes.length; i += 1 ) {
		var prefix = prefixes[i];

		if ( typeof element[prefix + 'MatchesSelector'] === 'function' ) {
			return element[prefix + 'MatchesSelector']( selector );
		}
	}

	// TODO: add parent.querySelectorAll polyfill
	return false;
};
