;(function($) {

	$( document ).ready( function(){

	  $( "#your-collection" ).on( "click", "a.delete", $( this ), removeFont );
	  $( "#available-fonts" ).on( "click", "a.add", $( this ), addFont );
	  $( "#available-fonts" ).on( "dblclick", ".font", $( this ), addFont );
	
	  $( "#selectors" ).on( "click", "a.delete", $( this ), removeSelector );
	  $( "#selectors" ).on( "submit", "#new-selector-form", $( this ), addSelector );
	
	  $( "#selectors" ).on( "keyup", "#new-selector", $( this ), adjustSelectorBox );
	  $( "#variants-form" ).on( "click", "input[type='checkbox']", $( this ), toggleVariant );
	  
	  $( "#search" ).on( "keyup", "#search-input", $( this ), searchFonts );
	
	  $( "#your-collection" ).on( "click", ".font", $( this ), activateFont );
	
	  function addFont( e ) { $( e.target ).trigger( "addFont" );saveFonts();e.preventDefault(); }
	  function removeFont( e ) { $( e.target ).trigger( "removeFont" );e.preventDefault(); }
	
	  function addSelector( e ) { $( e.target ).trigger( "addSelector" );saveFonts();e.preventDefault(); }
	  function removeSelector( e ) { $( e.target ).trigger( "removeSelector" );saveFonts();e.preventDefault(); }
	
	  function adjustSelectorBox( e ) { $( e.target ).trigger( "adjustSelectorBox" ); }
	  function toggleVariant( e ) { $( e.target ).trigger( "toggleVariant" );saveFonts(); }
	  
	  function searchFonts( e ) { $( e.target ).trigger( "searchFonts" ); }
	
	  function activateFont( e ) { $( e.target ).trigger( "activateFont" );e.preventDefault(); }
	
	  function saveFonts( e ) { $("#your-collection").trigger( "saveFonts" ); }
	  
	  $( "#available-fonts" ).bind( "addFont" , function( e ){
	  
	    _this = $( e.target ).closest( ".font" );
	
	    if ( !_this.find( "a.add" ).hasClass( "disabled" ) ) {
	      $( "#your-collection" ).find( ".no-fonts" ).hide();
	      $( "#your-collection" ).find( ".font-list" ).show().append( _this.clone() )
	                                      .find( ".font:last-child" )
	                                      .hide().find( ".font-actions" )
	                                      .html( "<li><a class='delete'><span></span></a></li>" )
	                                      .closest( ".font" )
	                                      .slideDown();
	      _this.find( "a.add" ).addClass( "disabled" ); 
	
	      if ( $( "#your-collection .font-list .font" ).length > 0 ) {
	        $( "#your-collection .sidebar" ).fadeIn();
	
	        if ( $( "#your-collection .font-list .font" ).length === 1 ) {
	          $( "#your-collection .font-list .font:first-child" ).addClass( "active" );
	        }
	      }
	
	      $( "#your-collection" ).find( ".font" ).filter( ":last-child" ).click();
	    }
	    
	  });
	  
	  $("#firsttimer").find('.btn').live('click',function(e){
	  	e.preventDefault();
	  	$.getJSON(ajaxurl,{ action : 'clear_firsttimer' },function(data){
	  		if(data.success)
			  	$('#firsttimer').delay(800).slideUp(600);
	  	});
	  });
	
	  $( "#your-collection" ).bind( "removeFont" , function( e ){
	
	    _this = e.target;
	    var removedIndex = $( _this ).closest( ".font" ).index();
	    var isFirst = $( _this ).closest( ".font" ).is(":first-child");
	    var isLast = $( _this ).closest( ".font" ).is(":last-child");
	    var isActive = $(_this).closest( ".font" ).hasClass("active");
	
	    $( _this ).closest( ".font" ).slideUp( function(){
	
	      $(this).remove();
	
	      if ( isActive ) {
	        if ( isFirst ) {
	          $("#your-collection .font:first-child").click();
	        }
	        else if ( isLast ) {
	          $("#your-collection .font:last-child").click();
	        }
	        else {
	          $("#your-collection .font:nth-child(" + (removedIndex + 1) + ")").click();
	        }
	      }
	
	      if ( $( "#your-collection .font-list .font" ).length === 0 ) {
	        $( "#your-collection" ).find( ".font-list" ).hide();
	        $( "#your-collection" ).find( ".sidebar" ).hide();
	        $( "#your-collection" ).find( ".no-fonts" ).fadeIn();
	      }
	
	      saveFonts();
	    });
	
	    $( "#available-fonts .font-list#loaded-fonts .font."+$( _this ).closest( ".font" ).find( ".font-sample span" ).prop( "class" )+" a.add" ).removeClass( "disabled" );
	
	    e.preventDefault();
	
	  });
	
	  $( "#selectors" ).bind( "addSelector" , function( e ){
	
	    _this = e.target;
	    var newSelectorName = $(this).find("#new-selector").val();
	
	    if (newSelectorName.length > 0) {
	      $(this).find("#new-selector").val("");
	
	      $("<li><span class='selector-name'>" + newSelectorName + "</span><a class='delete'><span></span></a></li>").insertBefore("li.add-new").closest("li");
	      $( _this ).closest("ul").find("li:last-child").prev().hide().fadeIn();
	
	      var currentSelectors = $( "#your-collection .font.active" ).attr("data-selectors") + "|" + newSelectorName;
	
	      $( "#your-collection .font.active" ).attr("data-selectors",currentSelectors);
	    }
	
	    e.preventDefault();
	
	  });
	
	  $( "#selectors" ).bind( "removeSelector" , function( e ){
	
	    _this = e.target;
	    var removedSelector = "|" + $( _this ).closest( "li" ).find(".selector-name").text();
	
	    $( _this ).closest( "li" ).fadeOut( function(){ $(this).remove() });
	
	    var newSelectors = $( "#your-collection .font.active" ).attr("data-selectors");
	    newSelectors = newSelectors.replace(removedSelector,"");
	
	    $( "#your-collection .font.active" ).attr("data-selectors",newSelectors);
	
	    e.preventDefault();
	
	  });
	
	  $( "#selectors" ).bind( "adjustSelectorBox" , function( e ){
	
	    _this = e.target;
	
	    $(_this).closest("#selectors").find(".new-selector-width").html($(_this).val());
	
	    var newWidth = $(_this).closest("#selectors").find(".new-selector-width").width() + 35;
	
	    if ( newWidth < 135 ) newWidth = 125;
	
	    $(_this).closest("li").css({width:newWidth+10+"px"},100);
	
	  });
	
	  $( "#variants-form" ).bind( "toggleVariant" , function( e ){
	
	    _this = e.target;
	    var variants = "";
	
	    $(_this).closest("#variants-form").find("input[type='checkbox']").each(function(){
	      variants += "|" + $(this).closest("label").find(".variant-name").text() + "-";
	      if ($(this).is(":checked")) variants += "1";
	      else variants += "0";
	    });
	
	    $( "#your-collection .font.active" ).attr("data-variants",variants);
	
	  });
	  
	  $( "#search" ).bind( "searchFonts" , function( e ){
	
	    _this = e.target;
	
	    $("#available-fonts .font-list#loaded-fonts").hide();
	    $("#available-fonts .no-results").hide();
	    $("#available-fonts .font-list#search-results").show();
	    
	    if ( $(_this).val().length > 1 ) {
	
	      var matchedFonts = "";
	      var fontResults = new Array();
	
	      for( i = 0; i < FontEasy.masterFontList.items.length; ++i ) { //iterate through all fonts
	        if( FontEasy.masterFontList.items[i].family.match($('#search-input').val() ) ) { //if a font matches the search term, add it to an array of matching fonts
	          var family_class = FontEasy.masterFontList.items[i].family.replace( / /g, '_' ).toLowerCase();
	          var variants = "";
	          $.each(FontEasy.masterFontList.items[i].variants,function(){
	            variants += "|" + this + "-1";
	          });
	
	          var defaultVariant = setDefaultVariant(FontEasy.masterFontList.items[i].variants);
	          
	          fontResults.push(FontEasy.masterFontList.items[i].family + ":" + defaultVariant);
	          matchedFonts += "<div class='font "+family_class+"' data-selectors='|."+family_class+"' data-variants='"+variants+"' data-name='"+FontEasy.masterFontList.items[i].family+"'><style type='text/css'> .font-sample span."+family_class+" { font-family: '"+FontEasy.masterFontList.items[i].family+"'; } </style><div class='font-sample'><span class='"+family_class+"'>"+FontEasy.previewText+"</span></div><div class='font-meta'><ul class='font-actions'><li><a class='edit'><span></span></a></li><li><a class='preview'><span></span></a></li><li><a class='add'><span></span></a></li></ul><!--/.font-actions--><div class='font-name'>"+FontEasy.masterFontList.items[i].family+"</div><div class='active-arrow'>&#9654;</div><!--/.active-arrow--></div><!--/.font-meta--><div class='clear'></div></div><!--/.font-->";
	        }
	      }
	
	      if (!matchedFonts) {
	        $("#available-fonts .font-list#search-results").hide();
	        $("#available-fonts .no-results").show();
	      }
	
	      WebFont.load( {
	        google: {
	          families: fontResults
	      }});
	
	      $("#available-fonts .font-list#search-results").html(matchedFonts);
	    }
	    else if ( $(_this).val().length === 0 ) {
	      $("#available-fonts .font-list#loaded-fonts").show();
	      $("#available-fonts .font-list#search-results").hide();
	      $("#available-fonts .no-results").hide();
	    }
	    else {
	      $("#available-fonts .font-list#search-results").hide();
	      $("#available-fonts .no-results").show();
	    }
	  });
	
	  $( "#your-collection" ).bind( "activateFont" , function( e ){
	
	    _this = e.target;
	
	    if ( $(_this).parents(".font-actions").length === 0 ) {
	      $( "#your-collection" ).find( ".font" ).removeClass("active");
	      $( _this ).closest( ".font" ).addClass("active");
	
	      var selectors = new Array();
	
	      // Save and remove old selectors
	      $( "#selectors li:not(.add-new)" ).each(function(){
	        selectors.push($(this).find(".selector-name").text());
	        $(this).remove();
	      });
	
	      selectors = $( _this ).closest( ".font" ).attr("data-selectors").split("|");
	      variants = $( _this ).closest( ".font" ).attr("data-variants").split("|");
	
	      var selectorMarkup = "";
	      var variantMarkup = "";
	
	      $.each(selectors,function(){
	        if (this.length !== 0)
	          selectorMarkup += "<li><span class='selector-name'>" + this + "</span><a class='delete'><span></span></a></li>";
	      });
	
	      var i = 1;
	
	      $.each(variants,function(){
	        if (this.length !== 0) {
	          var checkedMarkup = "";
	          if (this.indexOf("-1") >= 0) checkedMarkup = "checked='checked'";
	          variantMarkup += "<label for='variant-" + i + "'><input type='checkbox' " + checkedMarkup + " name='variant' id='variant-" + i + "'/><span class='variant-name'>"+this.slice(0,-2)+"</span></label>";
	          i++;
	        }
	      });
	
	      $("#selectors").prepend(selectorMarkup);
	      $("#variants-form").html(variantMarkup);
	
	      saveFonts();
	    }
	
	  });
	
	  $( "#your-collection" ).bind( "saveFonts" , function( e ){
	
	    _this = e.target;
	    var fontData = new Array();
	    var fontName,fontSelectors,fontVariants,isActive="",i=0;
	    
	    $( "#your-collection .font" ).each(function(){
	      if ($(this).hasClass("active")) isActive = "|active";
	      else isActive = "";
	      fontName = $(this).attr("data-name") + isActive;
	      fontSelectors = $(this).attr("data-selectors");
	      fontVariants = $(this).attr("data-variants");
	
	      fontData[i] = [];
	
	      fontData[i].push(fontName);
	      fontData[i].push(fontSelectors);
	      fontData[i].push(fontVariants);
	
	      i++;
	    });
	
	    $.post(ajaxurl, { 'action' : 'saveFonts', 'json' : fontData});
	  });
	
	  $.getJSON( FontEasy.webFontURL, function( data ){
	    FontEasy.masterFontList = data;
	  });
	
	});
	
	function setEqualHeight() {
	  var highestCol = Math.max($("#your-collection .font-list-wrap").height(),$("#your-collection .sidebar").height());
	  $("#your-collection .font-list-wrap").height(highestCol);
	  $("#your-collection .sidebar").height(highestCol);
	}
	
	function setDefaultVariant(availableVariants) {
	  var defaultVariant = "";
	
	  if ($.inArray("400",availableVariants) > -1)
	    defaultVariant = "400";
	  else if ($.inArray("regular",availableVariants) > -1)
	    defaultVariant = "regular";
	  else if ($.inArray("300",availableVariants) > -1)
	    defaultVariant = "300";
	  else if ($.inArray("500",availableVariants) > -1)
	    defaultVariant = "500";
	  else if ($.inArray("200",availableVariants) > -1)
	    defaultVariant = "200";
	  else if ($.inArray("600",availableVariants) > -1)
	    defaultVariant = "600";
	  else if ($.inArray("100",availableVariants) > -1)
	    defaultVariant = "100";
	  else if ($.inArray("bold",availableVariants) > -1)
	    defaultVariant = "bold";
	  else if ($.inArray("700",availableVariants) > -1)
	    defaultVariant = "700";
	  else if ($.inArray("800",availableVariants) > -1)
	    defaultVariant = "800";
	  else if ($.inArray("900",availableVariants) > -1)
	    defaultVariant = "900";
	
	  return defaultVariant;
	}
	
	function disableSelection(element) {
	  if (typeof element.onselectstart != 'undefined') {
	      element.onselectstart = function() { return false; };
	  }
	  else if (typeof element.style.MozUserSelect != 'undefined') {
	    element.style.MozUserSelect = 'none';
	  } 
	  else {
	    element.onmousedown = function() { return false; };
	  }
	}
	
	var FontEasy = {
	  fontList: false,
	  masterFontList: false,
	  previewText: "The quick brown fox jumps over the lazy dog.",
	  apiKey: "AIzaSyDJYYVPLT9JaoMPF8G5cFm1YjTZMjknizE",
	  start: 0,
	  show: 8
	}
	
	FontEasy.baseURL = "http://fonts.googleapis.com/css?text="+FontEasy.previewText+"&family=";
	FontEasy.webFontURL = "https://www.googleapis.com/webfonts/v1/webfonts?key="+FontEasy.apiKey+"&sort=alpha&callback=?";
	
	google.load( "webfont", "1" );
	
	google.setOnLoadCallback( function() {
	
	  var getGoogleFonts = function( fontFamilies ){
	    $( fontFamilies).each( function( i ){
	      var family_class = this[0].replace( / /g, '_' ).toLowerCase();
	      var variants = "";
	
	      if( !$( "body" ).hasClass( "wf-"+family_class+"-n4-active" ) ){
	        $.each(this[1],function(){
	          variants += "|" + this + "-1";
	        });
	        $( '#available-fonts .font-list#loaded-fonts' ).append( "<div class='font "+family_class+"' data-selectors='|."+family_class+"' data-variants='"+variants+"' data-name='"+this[0]+"'><style type='text/css'> .font-sample span."+family_class+" { font-family: '"+this[0]+"'; } </style><div class='font-sample'><span class='"+family_class+"'>"+FontEasy.previewText+"</span></div><div class='font-meta'><ul class='font-actions'><li><a class='edit'><span></span></a></li><li><a class='preview'><span></span></a></li><li><a class='add'><span></span></a></li></ul><!--/.font-actions--><div class='font-name'>"+this[0]+"</div><div class='active-arrow'>&#9654;</div><!--/.active-arrow--></div><!--/.font-meta--><div class='clear'></div></div><!--/.font-->" );
	      }
	    });
	    
	    return fontFamilies;
	  }
	
	  
	  var populateFontList = function( data ){
	    if( data ){
	      FontEasy.fontList = data;
	    }
	  }
	  
	  var loadFonts = function( fontFamilies ){
	    
	    position = $( ".font-list#loaded-fonts" ).scrollTop();
	
	    if( !fontFamilies )
	      fontFamilies = FontEasy.fontList;
	 
	    if( fontFamilies.kind == "webfonts#webfontList" ){
	      var fontFamilies = [];
	
	      $( FontEasy.fontList.items.splice( FontEasy.start,FontEasy.show ) ).each( function( e ){
	        fontFamilies.push( [this.family,this.variants] );
	      });
	
	      getGoogleFonts( fontFamilies );
	
	      var fontFamilyNames = new Array();
	
	      $.each(fontFamilies,function(){
	        var defaultVariant = setDefaultVariant(this[1]);
	        fontFamilyNames.push(this[0] + ":" + defaultVariant);
	      });
	
	      WebFont.load( {
	        google: {
	          families: fontFamilyNames
	      }});
	    }
	  }

	  var loadUserData = function() {
	    $.getJSON(ajaxurl, { action: "getFonts" }, function(fontData) {

				var fonts = fontData.fonts;
	      var isActive = "";

	      if (typeof fonts != 'undefined') {
	        var fontFamilyNames = new Array();
	
	        $.each(fonts,function(){

						if(typeof this[2] != 'undefined'){
	          	
	          	variants = this[2].split("|");
	
		          $.each(variants,function(i){
		            variants[i] = variants[i].slice(0,-2);
		          });
		          var defaultVariant = setDefaultVariant(variants);
		          if (this[0].indexOf("|active") >= 0) isActive = " active";
		          else isActive = "";
		          var fontName = this[0].replace("|active","");
		          fontFamilyNames.push(fontName + ":" + defaultVariant);
		          var family_class = fontName.replace( / /g, '_' ).toLowerCase();
		          family_class = family_class.replace("|active","");
		          $( '#your-collection .font-list' ).append( "<div class='font "+family_class+isActive+"' data-selectors='"+this[1]+"' data-variants='"+this[2]+"' data-name='"+fontName+"'><style type='text/css'> .font-sample span."+family_class+" { font-family: '"+fontName+"'; } </style><div class='font-sample'><span class='"+family_class+"'>"+FontEasy.previewText+"</span></div><div class='font-meta'><ul class='font-actions'><li><a class='delete'><span></span></a></li></ul><!--/.font-actions--><div class='font-name'>"+fontName+"</div><div class='active-arrow'>&#9654;</div><!--/.active-arrow--></div><!--/.font-meta--><div class='clear'></div></div><!--/.font-->" );
		          $( '#your-collection .font.active' ).click();
		          
		        }

	        });

					if( fontFamilyNames.length ){

		        $( "#your-collection" ).find( ".no-fonts" ).hide();
		        $( "#your-collection" ).find( ".font-list" ).show();
		        $( "#your-collection" ).find( ".sidebar" ).show();
		
		        $( "#your-collection .font" ).each(function(){
		          var fontName = $(this).attr("data-name").replace( / /g, '_' ).toLowerCase();
		          $( "#available-fonts .font." + fontName ).find("a.add").addClass("disabled");
		        });
		
		        WebFont.load( {
		          google: {
		            families: fontFamilyNames
		        }});

	        }
	      }
	    });
	  }
	
	  $.getJSON( FontEasy.webFontURL, function( data ){
	    populateFontList( data );
	    loadFonts();
	    loadUserData();
	  });
	
	  $( "#more-fonts" ).click( function( e ){
	    loadFonts();
	    $( "#available-fonts .font-list#loaded-fonts" ).animate( {scrollTop:$( "#available-fonts .font-list#loaded-fonts" ).prop( "scrollHeight" )});
	    $( "#your-collection .font" ).each(function(){
	      var fontName = $(this).attr("data-name").replace( / /g, '_' ).toLowerCase();
	      $( "#available-fonts .font." + fontName ).find("a.add").addClass("disabled");
	    });
	    e.preventDefault();
	  });
	});

})(jQuery);