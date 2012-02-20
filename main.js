$(document).ready(function(){
  $(".selectors-group li a").live("click",function(e){
    setupForm(this);
    $(this).closest("ul").find("a").removeClass("active");
    $(this).addClass("active");
    e.preventDefault();
  });

  $(".selectors li a").live("click",function(e){
    $(this).closest("li").remove();
    e.preventDefault();
  });

  $(".add-selector").live("click",function(e){
    if ($("#new-selector").val()) {
      $(".selectors").append("<li><span>"+$("#new-selector").val()+"</span><a href='#'>&#10006;</a></li>");
      $("#new-selector").val("");
    }
    e.preventDefault();
  });

  $("form").submit(function(e){
    
    e.preventDefault();
  });
});

var selectorFont;

var setupForm = function(obj) {
  var selector = $(obj);
  var selectors = selector.text().split(",");

  $(".selectors").html("");
  $.each(selectors,function(e,i){
    $(".selectors").append("<li><span>"+i+"</span><a href='#'>&#10006;</a></li>");
  })

  selectorFont = selector.attr('rel');
  $("form input['radio']#"+selectorFont).attr("checked",true);
}

var log = function(e) {
  if (e)
    $(".log").append("<div>"+e+"</div>");
}

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
    FontEasy.webFontURL = "https://www.googleapis.com/webfonts/v1/webfonts?key="+FontEasy.apiKey+"&callback=?";

    var getGoogleFonts = function(fontFamilies){
      $(fontFamilies).each(function(i){
        var family_class = this.replace(/ /g, '_').toLowerCase();

        if(!$("body").hasClass("wf-"+family_class+"-n4-active")){
          $('.font-list').append("<style type='text/css'> ."+family_class+"{ font-family: '"+this+"'; } </style>");
          $('.font-list').append("<label for='"+family_class+"' class='"+family_class+"'><input type='radio' name='font' id='"+family_class+"' value='"+family_class+"'/><div>"+FontEasy.previewText+"<span>"+this+"</span></div></label>");
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

    $(".font-list-wrap").scroll(function(e){
      var elem = $(this);
      var inner = $(this).find(".font-list");

      if (Math.abs(inner.offset().top) + elem.height() + elem.offset().top >= inner.outerHeight()) {
        loadFonts();
        $("form input['radio']#"+selectorFont).attr("checked",true);
      }
    });
  });