'use strict';


var elementMatchesSelector = require( '../../helper/elementMatchesSelector' );


var LinkController = function LinkController( gallery, selector ) {

	// we can't do anything without a proper gallery
	if ( !gallery || typeof gallery.show !== 'function' || typeof gallery.showPrevious !== 'function' || typeof gallery.showPrevious !== 'function' ) {
		return false;
	}

	this.gallery = gallery;

	// we also can't do anything without how to look up the clicked link
	if ( !selector ) {
		return false;
	}

	this.selector = selector;

	// we want to be able to insert links to control the gallery
	// independent of the link being in the dom at this moment
	window.addEventListener( 'click', this.handleClick.bind( this ), false );

	return this;
};


var proto = LinkController.prototype;


proto.targetMatchesSelector = function targetMatchesSelector( target ) {
	if ( elementMatchesSelector( target, this.selector ) ) {
		return true;
	}

	var parentNode = target;
	while ( parentNode ) {
		if ( elementMatchesSelector( parentNode, this.selector ) ) {
			return true;
		}
		parentNode = parentNode.parentNode;
	}

	return false;
};


proto.handleClick = function ( event ) {
	var target = event.target;

	if ( this.targetMatchesSelector( target ) ) {
		event.preventDefault();

		var method = target.getAttribute( 'data-gallery-method' );
		if ( method && typeof this.gallery[method] === 'function' ) {
			var argument = target.getAttribute( 'data-gallery-argument' );
			this.gallery[method](argument);
		} else {
			this.gallery.showNext();
		}

	}

};


module.exports = LinkController;
