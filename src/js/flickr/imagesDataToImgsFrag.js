'use strict';


function imageSrcFromData( imageData ) {
	var url = 'https://farm' + imageData.farm + '.staticflickr.com/';
	url += imageData.server + '/';
	url += imageData.id + '_' + imageData.secret + '_b.jpg';
	return url;
}


module.exports = function imagesDataToImgsFrag( imagesData ) {
	var frag = document.createDocumentFragment();

	for ( var i = 0; i < imagesData.length; i++ ) {
		var imageData = imagesData[i];
		var img = new Image();
		img.src = imageSrcFromData( imageData );
		img.alt = imageData.title;
		frag.appendChild( img );
	}

	return frag;
};
