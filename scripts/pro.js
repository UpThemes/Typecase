;(function($) {

  $( document ).ready( function(){

		if( typeof(frontend) != 'undefined' ){
			
			if( !$('#font-css').length ){
				$('body').append('<div id="font-css"></div>');
			}

			$.getJSON( ajaxurl, { action : 'reloadFontPreview' }, function( data ){
			  if( data.css )
				  $('#font-css').html(data.css);
			});

		}

	  $('#available-fonts-toggle').on('click',function(e){
	  	e.preventDefault();
	  	$('#your-collection,#your-collection-toggle').removeClass('active');
	  	$(this).toggleClass('active');
	  	$('#available-fonts').toggleClass('active');
	  });

	  $('#your-collection-toggle').on('click',function(e){
	  	e.preventDefault();
			$('#available-fonts,#available-fonts-toggle').removeClass('active');
			$(this).toggleClass('active');
			$('#your-collection').toggleClass('active');
	  });

		$("#typecase").find("#your-collection-toggle").click();

	});

})(jQuery);