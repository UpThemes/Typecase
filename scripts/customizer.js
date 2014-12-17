/* globals _wpCustomizeHeader, _wpCustomizeBackground, _wpMediaViewsL10n */
jQuery(window).load(function () {
	
    var api = wp.customize;
	
	function resetAdvancedFonts( api, showAdvanced ){
		
		var advancedInputs = jQuery('#accordion-panel-theme_fonts li.control-subsection').not('#accordion-section-theme_fonts_main');

        if ( showAdvanced ) {
            advancedInputs.removeClass('hidden');
        } else {
            advancedInputs.addClass('hidden');
            jQuery('select', advancedInputs).each(function () {
                var slug = jQuery(this).attr('data-customize-setting-link');
                api.instance(slug).set('');
                api.instance(slug).previewer.refresh();
            });
        }
		
	}

    jQuery('#accordion-panel-theme_fonts').click(function () {
        api.section('theme_fonts_main').expand({
            allowMultiple: true
        });
		
		var showAdvanced = api.value('show_advanced_fonts')();
		
		resetAdvancedFonts( api, showAdvanced );
        
    });


    api('show_advanced_fonts', function (callback) {

        callback.bind(function ( showAdvanced ) {
            resetAdvancedFonts( api, showAdvanced );
        });

    });

});