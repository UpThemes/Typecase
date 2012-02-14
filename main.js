google.load("webfont", "1");

google.setOnLoadCallback(function() {

	var FontEasy = {
		fontList : false,
		previewText : "The quick brown fox jumps over the lazy dog.",
		apiKey : "AIzaSyDJYYVPLT9JaoMPF8G5cFm1YjTZMjknizE",
		start : 0,
		show : 10
	}
	
	FontEasy.baseURL = "http://fonts.googleapis.com/css?text="+FontEasy.previewText+"&family=";
	FontEasy.webFontURL = "https://www.googleapis.com/webfonts/v1/webfonts?key="+FontEasy.apiKey+"&callback=?";
	
	var log = function( obj ){
	
		if( console )
			console.log(obj);
	
	}

	var getGoogleFonts = function(fontFamilies){

		$(fontFamilies).each(function(i){

			var family_class = this.replace(/ /g, '_').toLowerCase();
			console.log(this);

			if( !$("body").hasClass("wf-"+family_class+"-n4-active") ){
				
				$('#fontList').append("<style type='text/css'> ."+family_class+"{ font-family: '"+this+"'; } </style>");
				$('#fontList').append("<div class='preview "+family_class+"'>"+FontEasy.previewText+"</div>");
				
			}

		});
		
		return fontFamilies;

	}

	
	var populateFontList = function( data ){
	
		if( data )
			FontEasy.fontList = data;
		
	}
	
	var loadFonts = function( fontFamilies ){
	
		position = $("#fontList").scrollTop();

		if( !fontFamilies )
			fontFamilies = FontEasy.fontList;

		if( fontFamilies.kind == "webfonts#webfontList" ){

			var fontFamilies = [];
			
			$(FontEasy.fontList.items.splice(FontEasy.start,FontEasy.show)).each(function(e){
					
				fontFamilies.push(this.family);
	
			});
			
			getGoogleFonts(fontFamilies);
		
			WebFont.load({
			  google: {
			    families: fontFamilies
			}});
			
		}	

	}

	$.getJSON( FontEasy.webFontURL, function( data ){

		populateFontList(data);

		loadFonts();

	});

	$("#fontListContainer").scroll(function(e){

		var elem = $(this);
		var inner = $(this).find("#fontList");
		if ( Math.abs(inner.offset().top) + elem.height() + elem.offset().top >= inner.outerHeight() ) {
			
			loadFonts();
			
		}
	
	});

});
