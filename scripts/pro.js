;(function($) {

	function updateBadge(){
		
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

  $( document ).ready( function(){

	  $( "#typecase" ).on( "click", "a.delete,a.add", $( this ), updateBadge );		
		$( "#your-collection" ).bind( "collectionFontsLoaded", updateBadge );

		if( typeof(frontend) != 'undefined' ){
			
			if( !$('#font-css').length ){
				$('body').append('<div id="font-css"></div>');
			}

			$.getJSON( ajaxurl, { action : 'reloadFontPreview', _nonce : typecase.nonce }, function( data ){

			  if( data.css )
				  $('#font-css').html(data.css);

        if( typeof(data._new_nonce.nonce) != 'undefined' )
         	typecase.nonce = data._new_nonce.nonce;

			});

		}

	  $('#available-fonts-toggle').on('click',function(e){
	  	e.preventDefault();
	  	$('#your-collection-wrap,#your-collection-toggle').removeClass('active');
	  	$(this).toggleClass('active');
	  	$('#available-fonts-wrap').toggleClass('active');
	  });

	  $('#your-collection-toggle').on('click',function(e){
	  	e.preventDefault();
			$('#available-fonts-wrap,#available-fonts-toggle').removeClass('active');
			$(this).toggleClass('active');
			$('#your-collection-wrap').toggleClass('active');
	  });

		$("#typecase").find("#your-collection-toggle").click();

	});

})(jQuery);