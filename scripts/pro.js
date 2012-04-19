;(function($) {

  $( document ).ready( function(){

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