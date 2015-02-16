'use strict';


var createNavItem = function createNavItem( innerText, method ) {
	var link = document.createElement( 'a' );
	link.className = 'arrow-nav-link';
	link.setAttribute( 'data-gallery-method', method );
	link.href = '#' + method;

	var span = document.createElement( 'span' );
	span.className = 'arrow-nav-link-text';
	span.innerText = innerText;
	link.appendChild(span);

	return link;
};


module.exports = function createArrowNav( wrapper ) {
	var frag = document.createDocumentFragment();

	var arrows = {
		'showPrevious': '‹',
		'showNext': '›'
	};

	for ( var arrow in arrows ) {
		var element = createNavItem( arrows[arrow], arrow );
		frag.appendChild( element );
	}

	var nav = document.createElement( 'nav' );
	nav.className = 'arrow-nav';
	nav.appendChild( frag );

	return wrapper.appendChild( nav );
	return wrapper.insertBefore( nav, wrapper.firstChild );
};
