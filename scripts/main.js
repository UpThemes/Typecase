;(function($) {

	function reloadFontPreview(){

		if( !$('#font-css').length )
			$('body').append('<div id="font-css"></div>');

		$.getJSON( ajaxurl, { action : 'reloadFontPreview', _nonce : typecase.nonce }, function( data ){
		  if( data.css )
			  $('#font-css').html(data.css);

      if( typeof(data._new_nonce.nonce) != 'undefined' )
       	typecase.nonce = data._new_nonce.nonce;
		});

	}

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

  $( document ).ready( function(){

    $( "#your-collection .font-list a.delete" ).live( "click", $( this ), removeFont );
    $( "#available-fonts a.add" ).live( "click", $( this ), addFont );
    $( "#available-fonts .font" ).live( "dblclick", $( this ), addFont );

    $( "#selectors a.delete" ).live( "click", $( this ), removeSelector );
    $( "#selectors #new-selector-form" ).live( "submit", $( this ), addSelector );

    $( "#selectors #new-selector" ).live( "keyup", $( this ), adjustSelectorBox );
    $( "#variants-form input[type='checkbox']" ).live( "click", $( this ), toggleVariant );
    $( "#subsets-form input[type='checkbox']" ).live( "click", $( this ), toggleSubset );

    $( ".sidebar #save-fonts" ).live( "click", $( this ), saveFonts );

    $( "#search #search-input" ).live( "keyup", $( this ), searchFonts );

    $( "#your-collection .font" ).live( "click", $( this ), activateFont );

    function addFont( e ) { $( e.target ).trigger( "addFont" );saveFonts();e.preventDefault(); }
    function removeFont( e ) { $( e.target ).trigger( "removeFont" );e.preventDefault(); }

    function addSelector( e ) { $( e.target ).trigger( "addSelector" );saveFonts();e.preventDefault(); }
    function removeSelector( e ) { $( e.target ).trigger( "removeSelector" );saveFonts();e.preventDefault(); }

    function adjustSelectorBox( e ) { $( e.target ).trigger( "adjustSelectorBox" ); }

    function toggleVariant( e ) { $( e.target ).trigger( "toggleVariant" );saveFonts(); }
    function toggleSubset( e ) { $( e.target ).trigger( "toggleSubset" );saveFonts(); }

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

        if( typeof(frontend) != 'undefined' ) {
          $("#your-collection-toggle .badge").html($("#your-collection .font-list .font").length).show();
          $("#your-collection-toggle .badge").animate({
            top:"-=4px"
          },100,function(){
            $(this).animate({top:"+=7px"},100,function(){
              $(this).animate({top:"-=3px"},100);
            });
          });
        }
      }

    });

    $("#firsttimer").find('#kill').live('click',function(e){
      e.preventDefault();
      $.getJSON(ajaxurl,{ action : 'clear_firsttimer', _nonce : typecase.nonce },function(data){

        if(data.success)
          $('#firsttimer').delay(800).slideUp(400);

        if( typeof(data._new_nonce.nonce) != 'undefined' )
         	typecase.nonce = data._new_nonce.nonce;

      });
    });

    $( "#your-collection" ).bind( "removeFont" , function( e ){

      _this = e.target;

      var fontName = $( _this ).closest( ".font" ).attr("data-name");

      var confirmRemove = confirm("Are you sure you want to remove \"" + fontName + "\" from your collection?\n\nYou will lose all selectors you have added to this font.");

      if (confirmRemove === true) {
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

          if( typeof(frontend) != 'undefined' ) {
            $("#your-collection-toggle .badge").html($("#your-collection .font-list .font").length).show();
            $("#your-collection-toggle .badge").animate({
              top:"-=4px"
            },100,function(){
              $(this).animate({top:"+=7px"},100,function(){
                $(this).animate({top:"-=3px"},100);
              });
            });
          }

          var font_name = $( _this ).closest( ".font" ).find(".font-sample span").attr("class").replace("font-item ","");

          $( "#available-fonts .font-list#loaded-fonts .font." + font_name ).find("a.add").removeClass( "disabled" );

          saveFonts();
        });

        e.preventDefault();
      }

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
        variants += "|" + $(this).closest("label").find(".variant-name").text() + "&";
        if ($(this).is(":checked")) variants += "1";
        else variants += "0";
      });

      $( "#your-collection .font.active" ).attr("data-variants",variants);

    });

    $( "#subsets-form" ).bind( "toggleSubset" , function( e ){

      _this = e.target;
      var subsets = "";

      $(_this).closest("#subsets-form").find("input[type='checkbox']").each(function(){
        subsets += "|" + $(this).closest("label").find(".subset-name").text() + "&";
        if ($(this).is(":checked")) subsets += "1";
        else subsets += "0";
      });

      $( "#your-collection .font.active" ).attr("data-subsets",subsets);

    });

    $( "#search" ).bind( "searchFonts" , function( e ){

      _this = e.target;

      $("#available-fonts .font-list#loaded-fonts").hide();
      $("#available-fonts .no-results").hide();
      $("#available-fonts .font-list#search-results").show();
      $("#available-fonts").addClass("searching");

      if ( $(_this).val().length > 2 ) {

        var matchedFonts = "";
        var fontResults = new Array();

        $("#available-fonts #more-fonts").hide();

        for( i = 0; i < Typecase.masterFontList.items.length; ++i ) { //iterate through all fonts
          if( Typecase.masterFontList.items[i].family.toLowerCase().match($('#search-input').val().toLowerCase() ) ) { //if a font matches the search term, add it to an array of matching fonts
            var family_class = Typecase.masterFontList.items[i].family.replace( / /g, '_' ).toLowerCase();
            var variants = "";
            var subsets = "";

            $.each(Typecase.masterFontList.items[i].variants,function(){
              variants += "|" + this + "&1";
            });

            $.each(Typecase.masterFontList.items[i].subsets,function(){
              subsets += "|" + this + "&1";
            });

            var defaultVariant = setDefaultVariant(Typecase.masterFontList.items[i].variants);

            fontResults.push(Typecase.masterFontList.items[i].family + ":" + defaultVariant);
            matchedFonts += "<div class='font "+family_class+"' data-selectors='|."+family_class+"' data-variants='"+variants+"' data-subsets='"+subsets+"' data-name='"+Typecase.masterFontList.items[i].family+"'><div class='font-meta'><ul class='font-actions'><li><a class='edit'><span></span></a></li><li><a class='preview'><span></span></a></li><li><a class='add'><span></span></a></li></ul><!--/.font-actions--><div class='font-name'>"+Typecase.masterFontList.items[i].family+"</div><div class='active-arrow'></div><!--/.active-arrow--></div><!--/.font-meta--><style type='text/css'> .font-sample span."+family_class+" { font-family: '"+Typecase.masterFontList.items[i].family+"'; } </style><div class='font-sample'><span class='font-item "+family_class+"'>"+Typecase.previewText+"</span></div><div class='clear'></div></div><!--/.font-->";
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

        $( "#your-collection .font" ).each(function(){
          var fontName = $(this).attr("data-name").replace( / /g, '_' ).toLowerCase();
          $( "#available-fonts .font." + fontName ).find("a.add").addClass("disabled");
        });
      }
      else if ( $(_this).val().length === 0 ) {
        $("#available-fonts .font-list#loaded-fonts").show();
        $("#available-fonts .font-list#search-results").hide();
        $("#available-fonts .no-results").hide();
        $("#available-fonts #more-fonts").show();
        $("#available-fonts").removeClass("searching");
      }
      else {
        $("#available-fonts .font-list#search-results").hide();
        $("#available-fonts .no-results").show();
        $("#available-fonts #more-fonts").hide();
        $("#available-fonts").addClass("searching");
      }
    });

    $( "#your-collection" ).bind( "activateFont" , function( e ){

      _this = e.target;

      if ( $(_this).parents(".font-actions").length === 0 ) {
        $( "#your-collection" ).find( ".font" ).removeClass("active");
        $( _this ).closest( ".font" ).addClass("active");

        var selectors = new Array();
        var variants = new Array();
        var subsets = new Array();

        // Save and remove old selectors
        $( "#selectors li:not(.add-new)" ).each(function(){
          selectors.push($(this).find(".selector-name").text());
          $(this).remove();
        });

        selectors = $( _this ).closest( ".font" ).attr("data-selectors").split("|");
        variants = $( _this ).closest( ".font" ).attr("data-variants").split("|");
        subsets = $( _this ).closest( ".font" ).attr("data-subsets").split("|");

        var selectorMarkup = "";
        var variantMarkup = "";
        var subsetsMarkup = "";

        $.each(selectors,function(){
          if (this.length !== 0)
            selectorMarkup += "<li><span class='selector-name'>" + this + "</span><a class='delete'><span></span></a></li>";
        });

        var i = 1;

        $.each(variants,function(){
          if (this.length !== 0) {
            var checkedMarkup = "";
            if (this.indexOf("&1") >= 0) checkedMarkup = "checked='checked'";
            variantMarkup += "<label for='variant-" + i + "'><input type='checkbox' " + checkedMarkup + " name='variant' id='variant-" + i + "'/><span class='variant-name'>"+this.slice(0,-2)+"</span></label>";
            i++;
          }
        });

        $.each(subsets,function(){
          if (this.length !== 0) {
            var checkedMarkup = "";
            if (this.indexOf("&1") >= 0) checkedMarkup = "checked='checked'";
            subsetsMarkup += "<label for='subset-" + i + "'><input type='checkbox' " + checkedMarkup + " name='subset' id='subset-" + i + "'/><span class='subset-name'>"+this.slice(0,-2)+"</span></label>";
            i++;
          }
        });

        $("#selectors").prepend(selectorMarkup);
        $("#variants-form").html(variantMarkup);
        $("#subsets-form").html(subsetsMarkup);

      }

    });

    $( "#your-collection" ).bind( "saveFonts" , function( e ){

      _this = e.target;

      $(".sidebar #save-fonts").addClass("saving").html("Saving...");

      var fontData = new Array();
      var fontName,fontSelectors,fontVariants,fontSubsets,isActive="",i=0;

      $( "#your-collection .font" ).each(function(){
        if ($(this).hasClass("active")) isActive = "|active";
        else isActive = "";
        fontName = $(this).attr("data-name") + isActive;
        fontSelectors = $(this).attr("data-selectors");
        fontVariants = $(this).attr("data-variants");
        fontSubsets = $(this).attr("data-subsets");

        fontData[i] = [];

        fontData[i].push(fontName);
        fontData[i].push(fontSelectors);
        fontData[i].push(fontVariants);
        fontData[i].push(fontSubsets);

        i++;
      });

      $.post(ajaxurl, { 'action' : 'saveFonts', '_nonce' : typecase.nonce, 'json' : fontData},function(data){

        if( typeof(data._new_nonce.nonce) != 'undefined' )
      		typecase.nonce = data._new_nonce.nonce;

			  if( typeof(frontend) != 'undefined' )
					reloadFontPreview();

	      $(".sidebar #save-fonts").html("Saved!").animate({border:"none"},500,function(){
	        $(this).removeClass("saving").html("Save Fonts");
	      });

      });

    });

    $.getJSON( Typecase.webFontURL, function( data ){
      Typecase.masterFontList = data;
    });

  });

  var Typecase = {
    fontList: false,
    masterFontList: false,
    previewText: "The quick brown fox jumps over the lazy dog.",
    apiKey: "AIzaSyDJYYVPLT9JaoMPF8G5cFm1YjTZMjknizE",
    start: 0,
    show: 8
  }

  Typecase.baseURL = "http://fonts.googleapis.com/css?text="+Typecase.previewText+"&family=";
  Typecase.webFontURL = "https://www.googleapis.com/webfonts/v1/webfonts?key="+Typecase.apiKey+"&sort=alpha&callback=?";

  google.load( "webfont", "1" );

  google.setOnLoadCallback( function() {

    var getGoogleFonts = function( fontFamilies ){
      $( fontFamilies).each( function( i ){
        var family_class = this[0].replace( / /g, '_' ).toLowerCase();
        var variants = "";
        var subsets = "";

        if( !$( "body" ).hasClass( "wf-"+family_class+"-n4-active" ) ){
          $.each(this[1],function(){
            variants += "|" + this + "&1";
          });
          $.each(this[2],function(){
            subsets += "|" + this + "&1";
          });
          $( '#available-fonts .font-list#loaded-fonts' ).append( "<div class='font "+family_class+"' data-selectors='|."+family_class+"' data-variants='"+variants+"' data-subsets='"+subsets+"' data-name='"+this[0]+"'><div class='font-meta'><ul class='font-actions'><li><a class='edit'><span></span></a></li><li><a class='preview'><span></span></a></li><li><a class='add'><span></span></a></li></ul><!--/.font-actions--><div class='font-name'>"+this[0]+"</div><div class='active-arrow'></div><!--/.active-arrow--></div><!--/.font-meta--><style type='text/css'> .font-sample span."+family_class+" { font-family: '"+this[0]+"'; } \n .wf-"+family_class+"-n4-loading .font-sample span."+family_class+" { background-image:url('"+typecase.loading_gif+"'); text-indent: -9000; display:block; overflow:hidden; background-repeat: no-repeat; background-position: center left; color: #f9f9f9; padding-left:23px; } \n .wf-"+family_class+"-n4-loading .font-sample span."+family_class+":before{ content:'loading'; color: #aaa; font-size:12px; font-family: Helvetica, Arial, Tahoma, sans-serif; text-transform:uppercase; } </style><div class='font-sample'><span class='font-item "+family_class+"'>"+Typecase.previewText+"</span></div><div class='clear'></div></div><!--/.font-->" );
        }
      });

      return fontFamilies;
    }


    var populateFontList = function( data ){
      if( data ){
        Typecase.fontList = data;
      }
    }

    var loadFonts = function( fontFamilies ){

      position = $( ".font-list#loaded-fonts" ).scrollTop();

      if( !fontFamilies )
        fontFamilies = Typecase.fontList;

      if( fontFamilies.kind == "webfonts#webfontList" ){
        var fontFamilies = [];

        $( Typecase.fontList.items.splice( Typecase.start,Typecase.show ) ).each( function( e ){
          fontFamilies.push( [this.family,this.variants,this.subsets] );
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
      $.getJSON(ajaxurl, { action: "getFonts", _nonce : typecase.nonce }, function(fontData) {

        var fonts = fontData.fonts;
        var isActive = "";

        if( typeof(fontData._new_nonce.nonce) != 'undefined' )
         	typecase.nonce = fontData._new_nonce.nonce;

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
              $( '#your-collection .font-list' ).append( "<div class='font "+family_class+isActive+"' data-selectors='"+this[1]+"' data-variants='"+this[2]+"' data-subsets='"+this[3]+"' data-name='"+fontName+"'><div class='font-meta'><ul class='font-actions'><li><a class='delete'><span></span></a></li></ul><!--/.font-actions--><div class='font-name'>"+fontName+"</div><div class='active-arrow'></div><!--/.active-arrow--></div><!--/.font-meta--><style type='text/css'> .font-sample span."+family_class+" { font-family: '"+fontName+"'; } \n .wf-"+family_class+"-n4-loading .font-sample span."+family_class+" { background-image:url('"+typecase.loading_gif+"'); text-indent: -9000; display:block; overflow:hidden; background-repeat: no-repeat; background-position: center left; color: #f9f9f9; padding-left:23px; } \n .wf-"+family_class+"-n4-loading .font-sample span."+family_class+":before{ content:'loading'; color: #aaa; font-size:12px; font-family: Helvetica, Arial, Tahoma, sans-serif; text-transform:uppercase; } </style><div class='font-sample'><span class='font-item "+family_class+"'>"+Typecase.previewText+"</span></div><div class='clear'></div></div><!--/.font-->" );
              $( '#your-collection .font.active' ).click();

            }

          });

          if( fontFamilyNames.length ){

						$("#your-collection").trigger('collectionFontsLoading');

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

						$("#your-collection").trigger('collectionFontsLoaded');

          }
        }
      });
    }

    $.getJSON( Typecase.webFontURL, function( data ){
      populateFontList( data );
      loadFonts();
      loadUserData();
    });

    $( "#more-fonts" ).live("click", function( e ){
      $(this).trigger('moreFontsLoading');
      loadFonts();
      $( "#available-fonts .font-list#loaded-fonts" ).animate( {scrollTop:$( "#available-fonts .font-list#loaded-fonts" ).prop( "scrollHeight" )});
      $( "#available-fonts .content-wrap" ).animate( {scrollTop:"+=647px"},1000);
      $( "#your-collection .font" ).each(function(){
        var fontName = $(this).attr("data-name").replace( / /g, '_' ).toLowerCase();
        $( "#available-fonts .font." + fontName ).find("a.add").addClass("disabled");
      });
      $(this).trigger('moreFontsLoaded');
      e.preventDefault();
    });
  });

})(jQuery);