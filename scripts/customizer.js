/* globals _wpCustomizeHeader, _wpCustomizeBackground, _wpMediaViewsL10n */

// wait for window load - no iframe ready event (yet)
jQuery(window).load(function () {
	
	// convert WordPress version to int
	WPversion = parseInt( WPversion.toString() );

	//	stash the wp.customize object
    var api = wp.customize;

	// advanced sections are all subsections except the main section
	var advancedInputs = jQuery('#accordion-panel-theme_fonts li.control-subsection').not('#accordion-section-theme_fonts_main');

	/*
	* Function to toggle advanced font options visibility
	*/
	function toggleAdvancedFonts( showAdvanced ){
		if ( showAdvanced ) {

			// remove the hidden class on advanced sections to make them visible
			advancedInputs.removeClass('hidden');

		} else{

			// add the hidden class on advanced sections to hide them
			advancedInputs.addClass('hidden');

		}
	}

	/*
	* Function to reset advanced font options
	*/
	function resetAdvancedFonts( showAdvanced ){

		// if show advanced options is false
		if ( !showAdvanced ) {

			jQuery('select', advancedInputs).each(function () {

				// get the unique setting slug
				var slug = jQuery(this).attr('data-customize-setting-link');

				// reset the value in customizer 
				api.instance(slug).set('');

			});

		}

		// refresh the preview
		api.previewer.refresh();

	}

	// get the show advanced options value
	var showAdvanced = api.value('show_advanced_fonts')();

	// reset advanced fonts
	resetAdvancedFonts( showAdvanced );

	// when the theme fonts panel link is clicked
    jQuery('#accordion-panel-theme_fonts').click(function () {
		
		// check if at least version 4.1 wp.customize.section added in 4.1
		if ( WPversion >= 4.1 ) {
			
			// open the main subsection
			api.section('theme_fonts_main').expand({
	
				// allow multiple sections to be open at a time
				allowMultiple: true
	
			});
			
		// otherwise if WordPress version is less than 4.1
		} else{
			
			// open main subsection manually
			jQuery('#accordion-section-theme_fonts_main ul.accordion-section-content').slideDown(function(){
				// and add CSS open class
				jQuery('#accordion-section-theme_fonts_main').addClass('open');
			});
			
		}

		// get the show advanced options value
		var showAdvanced = api.value('show_advanced_fonts')();

		// show/hide advanced fonts based on preference
		toggleAdvancedFonts( showAdvanced );

    });

	// when show advanced fonts option is changed
    api('show_advanced_fonts', function (callback) {

		// bind a callback function to the value
        callback.bind(function ( showAdvanced ) {

			// show/hide advanced fonts based on preference
			toggleAdvancedFonts( showAdvanced );

			// reset advanced fonts
			resetAdvancedFonts( showAdvanced );

        });

    });

});