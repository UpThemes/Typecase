$(function(){
  $("body").append("<style>.log{position:absolute;right:0;bottom:0;background:rgba(0,0,0,.9);color:#eee;line-height:2em;font-family:monospace;max-height:100%;max-width:100%;overflow:scroll;border-left:solid 1px black;}.log div{border-top:solid 1px rgba(255,255,255,.05);border-bottom:solid 1px rgba(0,0,0,1);padding:10px 20px;}</style><div class='log'></div>");
});

var log = function(e) {
  if (e)
    $(".log").append("<div>"+e+"</div>");
}

var clearLog = function() {
  $(".log").html("");
}