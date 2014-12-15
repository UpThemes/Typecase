<?php
/**
 * Class to create a custom font location select
 */
class Typecase_Font_Location_Dropdown_Custom_Control extends WP_Customize_Control {
    private $advanced = false;

    public function __construct( $wp_customize, $slug, $args = array() ) {

		// bail if no options
		if( empty( $args['choices'] ) ){
			return;
		}

		$this->args = $args;

        $this->advanced = ( isset( $args['advanced'] ) ? $args['advanced'] : false );

		$this->id = $slug;

        parent::__construct( $wp_customize, $slug, $args );

    }

    /**
    * Render the content on the theme customizer page
    */
    public function render_content(){

		$class = 'font-location';

		if( $this->advanced == true ){
			$class .= ' advanced';
			if( $this->args['show-advanced'] == false ){
				$class .= ' hidden';
			}
		}

		?>
			<label class="<?php echo $class; ?>">
				<span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
				<select name="<?php echo $this->id; ?>" id="<?php echo $this->id; ?>" data-customize-setting-link="<?php echo $this->id; ?>" class="customize-control customize-control-select" data-default="<?php echo $this->args['default']; ?>" data-selector="<?php echo $this->args['selector']; ?>" data-advanced="<?php echo $this->args['advanced'] ? 1 : 0; ?>">
				<?php
					foreach ( $this->args['choices'] as $value => $label ){
						printf('<option value="%s" %s>%s</option>', $value, selected($this->value(), $value, false), $label);
					}
				?>
				</select>
			</label>
			<?php
			if( $this->args['print-js'] ){
				?>
				<script type="text/javascript">
					jQuery(window).load(function() {

						var advancedInputs = jQuery('#accordion-section-theme_fonts .font-location.advanced');
						var showAdvanced = wp.customize.value('show_advanced_fonts')();

						if ( showAdvanced ) {
							advancedInputs.removeClass('hidden');
						}
						
						wp.customize('show_advanced_fonts',function( callback ) {
							callback.bind( function( value ) {
								if ( value === true ) {
									advancedInputs.removeClass( 'hidden' );
								} else {
									advancedInputs.addClass( 'hidden' );
								}
							});
						});

					} );
				</script>
			<?php
		}
    }
}