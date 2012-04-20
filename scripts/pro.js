;(function($) { // jQuery encapsulation to avoid conflict with other JS libraries in WordPress

	/**
	* Badge Updater for Front-End Editor
	*
	* This function updates the red badge with the number
	* of fonts currently added to "Your Collection."
	*/
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

		// Make sure we're on the frontend
		if( typeof(frontend) != 'undefined' ){

			/**
			* Find all anchors and add the front_end_editor 
			* variable to the end of each href.
			*/
			$('*:not("#typecase") a:not([href*="wp-admin"])').each(function(i){
				new_href = $(this).attr("href")+"?front_end_editor=1";
				$(this).attr("href",new_href);
			});

			// Badge Updater Event Attachments
		  $( "#typecase" ).on( "click", "a.delete,a.add", $( this ), updateBadge );		
			$( "#your-collection" ).bind( "collectionFontsLoaded", updateBadge );

			/**
			 * Make sure the #font-css container isn't already here
			 * and add it if it is not here.
			 */
			if( !$('#font-css').length ){
				$('body').append('<div id="font-css"></div>');
			}

			// Reload our font preview on first page load
			$.getJSON( ajaxurl, { action : 'reloadFontPreview', _nonce : typecase.nonce }, function( data ){

				// Do we have CSS data? If so, LOAD IT!
			  if( data.css )
				  $('#font-css').html(data.css);

				// Do we have a new nonce? If so, SET IT!
        if( typeof(data._new_nonce.nonce) != 'undefined' )
         	typecase.nonce = data._new_nonce.nonce;

			});

		}

		/**
		 * Toggle the "Available Fonts" button
		 */
	  $('#available-fonts-toggle').on('click',function(e){
	  	e.preventDefault();
	  	$('#your-collection-wrap,#your-collection-toggle').removeClass('active');
	  	$(this).toggleClass('active');
	  	$('#available-fonts-wrap').toggleClass('active');
	  });

		/**
		 * Toggle the "Your Collection" button
		 */
	  $('#your-collection-toggle').on('click',function(e){
	  	e.preventDefault();
			$('#available-fonts-wrap,#available-fonts-toggle').removeClass('active');
			$(this).toggleClass('active');
			$('#your-collection-wrap').toggleClass('active');
	  });

		$("#typecase").find("#your-collection-toggle").click();

	});

})(jQuery);