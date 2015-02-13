'use strict';

var Main = (function() {
	return {

		initialize: function() {
			return this;
		},

		photoSrc: function(photo) {
			return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
		},

		photo: function(photo) {
			console.log(photo.urls.url[0]._content);
		},

		handleApiResponse: function(data) {
			if (data.photoset && data.photoset.photo) {
				var photos = data.photoset.photo;
				var frag = document.createDocumentFragment();
				photos.forEach(function(photo) {
					var img = new Image();
					img.src = Main.photoSrc(photo);
					frag.appendChild(img);
				});

				var div = document.createElement('div');
				div.className = 'photobox';
				div.appendChild(frag);

				document.body.appendChild(div);
			}
		}

	};
}());


window.jsonFlickrApi = Main.handleApiResponse;


module.exports = Main.initialize();
