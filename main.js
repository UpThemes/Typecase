$( document ).ready( function(){

  $( "#your-collection" ).on( "click", "a[href='#delete']", $( this ), removeFont );
  $( "#available-fonts" ).on( "click", "a[href='#add']", $( this ), addFont );

  $( "#selectors" ).on( "click", "a[href='#delete']", $( this ), removeSelector );
  $( "#selectors" ).on( "submit", "#new-selector-form", $( this ), addSelector );

  $( "#selectors" ).on( "keyup", "#new-selector", $( this ), adjustSelectorBox );
  $( "#variants-form" ).on( "click", "input[type='checkbox']", $( this ), toggleVariant );

  $( "#your-collection" ).on( "click", ".font", $( this ), activateFont );

  function addFont( e ) { $( e.target ).trigger( "addFont" );saveFonts();e.preventDefault(); }
  function removeFont( e ) { $( e.target ).trigger( "removeFont" );saveFonts();e.preventDefault(); }

  function addSelector( e ) { $( e.target ).trigger( "addSelector" );saveFonts();e.preventDefault(); }
  function removeSelector( e ) { $( e.target ).trigger( "removeSelector" );saveFonts();e.preventDefault(); }

  function adjustSelectorBox( e ) { $( e.target ).trigger( "adjustSelectorBox" ); }
  function toggleVariant( e ) { $( e.target ).trigger( "toggleVariant" );saveFonts(); }

  function activateFont( e ) { $( e.target ).trigger( "activateFont" );e.preventDefault(); }

  function saveFonts( e ) { $("#your-collection").trigger( "saveFonts" ); }
  
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

    if (newSelectorName.length > 0) {
      $(this).find("#new-selector").val("");

      $("<li><span class='selector-name'>" + newSelectorName + "</span><a href='#delete'><span></span></a></li>").insertBefore("li.add-new").closest("li");
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

    if ( newWidth < 127 ) newWidth = 127;

    $(_this).css({width:newWidth+"px"},100); 
    $(_this).closest("li").css({width:newWidth+6+"px"},100);

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
          selectorMarkup += "<li><span class='selector-name'>" + this + "</span><a href='#delete'><span></span></a></li>";
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

    }

  });

  $( "#your-collection" ).bind( "saveFonts" , function( e ){

    _this = e.target;
    var fontData = new Array();
    var fontName,fontSelectors,fontVariants,i=0;
    
    $( "#your-collection .font" ).each(function(){
      fontName = $(this).attr("data-name");
      fontSelectors = $(this).attr("data-selectors");
      fontVariants = $(this).attr("data-variants");

      fontData[i] = [];

      fontData[i].push(fontName);
      fontData[i].push(fontSelectors);
      fontData[i].push(fontVariants);

      i++;
    });

    $.post("save.php", {json : fontData});
    console.log(fontData);

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
    $( fontFamilies).each( function( i ){
      var family_class = this[0].replace( / /g, '_' ).toLowerCase();
      var variants = "";

      if( !$( "body" ).hasClass( "wf-"+family_class+"-n4-active" ) ){
        $.each(this[1],function(){
          variants += "|" + this + "-1";
        });
        $( '#available-fonts .font-list' ).append( "<div class='font "+family_class+"' data-selectors='|."+family_class+"' data-variants='"+variants+"' data-name='"+this[0]+"'><style type='text/css'> .font-sample span."+family_class+" { font-family: '"+this[0]+"'; } </style><div class='font-sample'><span class='"+family_class+"'>"+FontEasy.previewText+"</span></div><div class='font-meta'><div class='font-name'>"+this[0]+"</div><ul class='font-actions'><li><a href='#edit'><span></span></a></li><li><a href='#preview'><span></span></a></li><li><a href='#add'><span></span></a></li></ul><!--/.font-actions--><div class='active-arrow'>&#9654;</div><!--/.active-arrow--></div><!--/.font-meta--><div class='clear'></div></div><!--/.font-->" );
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
        fontFamilies.push( [this.family,this.variants] );
      });

      getGoogleFonts( fontFamilies );

      var fontFamilyNames = new Array();

      $.each(fontFamilies,function(){
        fontFamilyNames.push(this[0]);
      });

      WebFont.load( {
        google: {
          families: fontFamilyNames
      }});
    }
  }

  var loadUserData = function() {
    $.getJSON("fonts.json", function(fontData) {
      var jsonData = JSON.stringify(fontData);
      console.log(jsonData);

      if (fontData) {
        var fontFamilyNames = new Array();

        $.each(fontData,function(){
          fontFamilyNames.push(this[0]);
          var family_class = this[0].replace( / /g, '_' ).toLowerCase();
          $( '#your-collection .font-list' ).append( "<div class='font "+family_class+"' data-selectors='"+this[1]+"' data-variants='"+this[2]+"' data-name='"+this[0]+"'><style type='text/css'> .font-sample span."+family_class+" { font-family: '"+this[0]+"'; } </style><div class='font-sample'><span class='"+family_class+"'>"+FontEasy.previewText+"</span></div><div class='font-meta'><div class='font-name'>"+this[0]+"</div><ul class='font-actions'><li><a href='#delete'><span></span></a></li></ul><!--/.font-actions--><div class='active-arrow'>&#9654;</div><!--/.active-arrow--></div><!--/.font-meta--><div class='clear'></div></div><!--/.font-->" );
        });

        $( "#your-collection" ).find( ".no-fonts" ).hide();
        $( "#your-collection" ).find( ".font-list" ).show();
        $( "#your-collection" ).find( ".sidebar" ).show();
        $( "#your-collection .font-list .font:first-child" ).click();

        $( "#your-collection .font" ).each(function(){
          var fontName = $(this).attr("data-name").replace( / /g, '_' ).toLowerCase();
          $( "#available-fonts .font." + fontName ).find("a[href='#add']").addClass("disabled");
        });

        WebFont.load( {
          google: {
            families: fontFamilyNames
        }});
      }
    });
  }

  $.getJSON( FontEasy.webFontURL, function( data ){
    populateFontList( data );
    loadFonts();
    loadUserData();
  });

  $( "a[href='#more-fonts']" ).click( function( e ){
    loadFonts();
    $( "#available-fonts .font-list" ).animate( {scrollTop:$( "#available-fonts .font-list" ).prop( "scrollHeight" )});
    $( "#your-collection .font" ).each(function(){
      var fontName = $(this).attr("data-name").replace( / /g, '_' ).toLowerCase();
      $( "#available-fonts .font." + fontName ).find("a[href='#add']").addClass("disabled");
    });
    e.preventDefault();
  });
});