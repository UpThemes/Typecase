$(document).ready(function(){

  $("#your-collection").on("click", "a[href='#delete']", $(this), removeFont);
  $("#available-fonts").on("click", "a[href='#add']", $(this), addFont);
  
  function addFont(e) {$(e.target).trigger("addFont");e.preventDefault();}
  function removeFont(e) {$(e.target).trigger("removeFont");e.preventDefault();}
  
  $("#available-fonts").bind("addFont",function(e){
  
    if (!$(e.target).closest("a").hasClass("disabled")) {
      $("#your-collection").find(".font-list").append($(e.target).closest(".font").clone())
                                      .find(".font:last-child")
                                      .hide().find(".font-actions")
                                      .html("<li><a href='#delete'><span></span></a></li>")
                                      .closest(".font")
                                      .slideDown();
      $(e.target).closest("a").addClass("disabled"); 
    }
    
  });
    
  $("#your-collection").bind("removeFont",function(e){

    _this = e.target;
    $(_this).closest(".font").slideUp(function(){$(_this).remove()});
    $("#available-fonts .font-list .font."+$(_this).closest(".font").find(".font-sample span").prop("class")+" a[href='#add']").removeClass("disabled");
    e.preventDefault();

  });

});

/*

google.load("webfont", "1");
  
google.setOnLoadCallback(function() {
  var FontEasy = {
    fontList: false,
    previewText: "The quick brown fox jumps over the lazy dog.",
    apiKey: "AIzaSyDJYYVPLT9JaoMPF8G5cFm1YjTZMjknizE",
    start: 0,
    show: 4
  }
  
  FontEasy.baseURL = "http://fonts.googleapis.com/css?text="+FontEasy.previewText+"&family=";
  FontEasy.webFontURL = "https://www.googleapis.com/webfonts/v1/webfonts?key="+FontEasy.apiKey+"&sort=alpha&callback=?";

  var getGoogleFonts = function(fontFamilies){
    $(fontFamilies).each(function(i){
      var family_class = this.replace(/ /g, '_').toLowerCase();

      if(!$("body").hasClass("wf-"+family_class+"-n4-active")){
        $('#available-fonts .font-list').append("<div class='font "+family_class+"' rel='."+family_class+"'><style type='text/css'> .font-sample span."+family_class+" { font-family: '"+this+"'; } </style><div class='font-sample'><span class='"+family_class+"'>"+FontEasy.previewText+"</span></div><div class='font-meta'><div class='font-name'>"+this+"</div><ul class='font-actions'><li><a href='#edit'><span></span></a></li><li><a href='#preview'><span></span></a></li><li><a href='#add'><span></span></a></li></ul><!--/.font-actions--></div><!--/.font-meta--><div class='clear'></div></div><!--/.font-->");
      }
    });
    
    return fontFamilies;
  }

  
  var populateFontList = function(data){
    if(data)
      FontEasy.fontList = data;
  }
  
  var loadFonts = function(fontFamilies){
    position = $(".font-list").scrollTop();

    if(!fontFamilies)
      fontFamilies = FontEasy.fontList;

    if(fontFamilies.kind == "webfonts#webfontList"){
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

  $.getJSON(FontEasy.webFontURL, function(data){
    populateFontList(data);
    loadFonts();
  });

  $("a[href='#more-fonts']").click(function(e){
    loadFonts();
    $("#available-fonts .font-list").animate({scrollTop:$("#available-fonts .font-list").prop("scrollHeight")});
    e.preventDefault();
  });
});

  */