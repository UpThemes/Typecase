$( document ).ready( function(){

  $( "#your-collection" ).on( "click", "a[href='#delete']", $( this ), removeFont );
  $( "#available-fonts" ).on( "click", "a[href='#add']", $( this ), addFont );

  $( "#selectors" ).on( "click", "a[href='#delete']", $( this ), removeSelector );
  $( "#selectors" ).on( "submit", "#new-selector-form", $( this ), addSelector );

  $( "#selectors" ).on( "keyup", "#new-selector", $( this ), adjustSelectorBox );

  $( "#your-collection" ).on( "click", ".font", $( this ), activateFont );

  function addFont( e ) { $( e.target ).trigger( "addFont" );e.preventDefault(); }
  function removeFont( e ) { $( e.target ).trigger( "removeFont" );e.preventDefault(); }

  function addSelector( e ) { $( e.target ).trigger( "addSelector" );e.preventDefault(); }
  function removeSelector( e ) { $( e.target ).trigger( "removeSelector" );e.preventDefault(); }

  function adjustSelectorBox( e ) { $( e.target ).trigger( "adjustSelectorBox" ); }

  function activateFont( e ) { $( e.target ).trigger( "activateFont" );e.preventDefault(); }
  
  $( "#available-fonts" ).bind( "addFont" , function( e ){
  
    if ( !$( e.target ).closest( "a" ).hasClass( "disabled" ) ) {
      $( "#your-collection" ).find( ".no-fonts" ).hide();
      $( "#your-collection" ).find( ".font-list" ).show().append( $( e.target ).closest( ".font" ).clone() )
                                      .find( ".font:last-child" )
                                      .hide().find( ".font-actions" )
                                      .html( "<li><a href='#delete'><span></span></a></li>" )
                                      .closest( ".font" )
                                      .slideDown();
      $( e.target ).closest( "a" ).addClass( "disabled" ); 

      if ( $( "#your-collection .font-list .font" ).length > 0 ) {
        $( "#your-collection .sidebar" ).fadeIn();

        if ( $( "#your-collection .font-list .font" ).length === 1 ) {
          $( "#your-collection .font-list .font:first-child" ).addClass( "active" );
        }
      }

      $( "#your-collection" ).find( ".font" ).filter( ":last-child" ).click();
    }
    
  });

  /*$( fonts ).each( function( i ) { //fonts is the object literal to search through

    var matchingFonts = {};

    for( i = 0; i < fonts.length; ++i ) { //iterate through all fonts
      if( fonts[i].match( ui.item ) ) { //if a font matches the search term, add it to an array of matching fonts
        matchingFonts[] = locales[i].match;
      }
    };

    return matchingFonts; // return matching font as an object literal

  });*/
    
  $( "#your-collection" ).bind( "removeFont" , function( e ){

    _this = e.target;
    var removedIndex = $( _this ).closest( ".font" ).index();
    var isFirst = $( _this ).closest( ".font" ).is(":first-child");
    var isLast = $( _this ).closest( ".font" ).is(":last-child");
    var isActive = $(_this).closest( ".font" ).hasClass("active");

    $( _this ).closest( ".font" ).slideUp( function(){

      $( _this ).closest( ".font" ).remove();

      if ( isActive ) {
        if ( isFirst ) {
          $("#your-collection .font:first-child").click();
        }
        else if ( isLast ) {
          $("#your-collection .font:last-child").click();
        }
        else {
          $("#your-collection .font:nth-child(" + removedIndex + ")").click();
        }
      }

      if ( $( "#your-collection .font-list .font" ).length === 0 ) {
        $( "#your-collection" ).find( ".font-list" ).hide();
        $( "#your-collection" ).find( ".sidebar" ).hide();
        $( "#your-collection" ).find( ".no-fonts" ).fadeIn();
      }

    });
    $( "#available-fonts .font-list .font."+$( _this ).closest( ".font" ).find( ".font-sample span" ).prop( "class" )+" a[href='#add']" ).removeClass( "disabled" );

    e.preventDefault();

  });

  $( "#selectors" ).bind( "addSelector" , function( e ){

    _this = e.target;
    var newSelectorName = $(this).find("#new-selector").val();
    $(this).find("#new-selector").val("");

    $("<li><span class='selector-name'>" + newSelectorName + "</span><a href='#delete'><span></span></a></li>").insertBefore("li.add-new").closest("li");
    $( _this ).closest("ul").find("li:last-child").prev().hide().fadeIn();

    e.preventDefault();

  });

  $( "#selectors" ).bind( "removeSelector" , function( e ){

    _this = e.target;
    $( _this ).closest( "li" ).fadeOut( function(){ $( _this ).remove() });
    e.preventDefault();

  });

  $( "#selectors" ).bind( "adjustSelectorBox" , function( e ){

    _this = e.target;

    $(_this).closest("#selectors").find(".new-selector-width").html($(_this).val());

    var newWidth = $(_this).closest("#selectors").find(".new-selector-width").width() + 35;

    if ( newWidth < 120 ) newWidth = 120;

    $(_this).css({width:newWidth+"px"},100); 
    $(_this).closest("li").css({width:newWidth+6+"px"},100);

  });

  $( "#your-collection" ).bind( "activateFont" , function( e ){

    _this = e.target;

    if ( $(_this).parents(".font-actions").length === 0 ) {
      $( "#your-collection" ).find( ".font" ).removeClass("active");
      $( _this ).closest( ".font" ).addClass("active");
    }

  });

});

google.load( "webfont", "1" );
  
google.setOnLoadCallback( function() {
  var FontEasy = {
    fontList: false,
    previewText: "The quick brown fox jumps over the lazy dog.",
    apiKey: "AIzaSyDJYYVPLT9JaoMPF8G5cFm1YjTZMjknizE",
    start: 0,
    show: 4
  }
  
  FontEasy.baseURL = "http://fonts.googleapis.com/css?text="+FontEasy.previewText+"&family=";
  FontEasy.webFontURL = "https://www.googleapis.com/webfonts/v1/webfonts?key="+FontEasy.apiKey+"&sort=alpha&callback=?";

  var getGoogleFonts = function( fontFamilies ){
    $( fontFamilies ).each( function( i ){
      var family_class = this.replace( / /g, '_' ).toLowerCase();

      if( !$( "body" ).hasClass( "wf-"+family_class+"-n4-active" ) ){
        $( '#available-fonts .font-list' ).append( "<div class='font "+family_class+"' rel='."+family_class+"'><style type='text/css'> .font-sample span."+family_class+" { font-family: '"+this+"'; } </style><div class='font-sample'><span class='"+family_class+"'>"+FontEasy.previewText+"</span></div><div class='font-meta'><div class='font-name'>"+this+"</div><ul class='font-actions'><li><a href='#edit'><span></span></a></li><li><a href='#preview'><span></span></a></li><li><a href='#add'><span></span></a></li></ul><!--/.font-actions--></div><!--/.font-meta--><div class='clear'></div></div><!--/.font-->" );
      }
    });
    
    return fontFamilies;
  }

  
  var populateFontList = function( data ){
    if( data )
      FontEasy.fontList = data;
  }
  
  var loadFonts = function( fontFamilies ){
    position = $( ".font-list" ).scrollTop();

    if( !fontFamilies )
      fontFamilies = FontEasy.fontList;

    if( fontFamilies.kind == "webfonts#webfontList" ){
      var fontFamilies = [];

      $( FontEasy.fontList.items.splice( FontEasy.start,FontEasy.show ) ).each( function( e ){
        fontFamilies.push( this.family );
      });

      getGoogleFonts( fontFamilies );
    
      WebFont.load( {
        google: {
          families: fontFamilies
      }});
    }

    $( "#available-fonts .font" ).each(function(){
      $(this).find("a[href='#add']").click();
    });
  }

  $.getJSON( FontEasy.webFontURL, function( data ){
    populateFontList( data );
    loadFonts();
  });

  $( "a[href='#more-fonts']" ).click( function( e ){
    loadFonts();
    $( "#available-fonts .font-list" ).animate( {scrollTop:$( "#available-fonts .font-list" ).prop( "scrollHeight" )});
    e.preventDefault();
  });
});