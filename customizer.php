<?php
// don't call the file directly
if ( ! defined( 'ABSPATH' ) ){
	return;
}

/*
 * Theme support should be declared for 'typecase'
 * with a $font_locations array passed as a parameter
 *
 * $font_locations should be a multi-dimensional array
 * and contain 'label', 'selector' and 'default' for each font location
 *
 * Example:
	$font_locations = array( 
		array( 
			'label' => 'Main Title',
			'selector' => 'h1.entry-title',
			'default' => 'Lato, sans-serif',
		),
		array( 
			'label' => 'Main Content',
			'selector' => '.entry-content',
			'default' => 'Lato, sans-serif',
		),
	);
 *
 */
class Typecase_Customizer extends Typecase {

	protected $typecase_url = '';
	protected $theme_font_locations;
	protected $font_collection;
	protected $select_ids = array();

	public function Typecase(){

		$this->__construct();

	}

	/**
	* Constructor for the Typecase class
	*
	* Sets up all the appropriate hooks and actions
	* within our plugin.
	*
	* @uses parent::__construct()
	* @uses add_action()
	*
	*/
 	public function __construct() {

		// get theme font locations
		$this->theme_font_locations = $this->get_theme_font_locations();

		// bail if no theme font locations
		if( $theme_font_locations === false ){

			return;

		}

		// get typecase fonts
		$fonts = get_option( 'typecase_fonts' );

		// if no fonts in typcase collection
		if( empty( $fonts ) ){

			// set font collection to false
			$this->font_collection = false;

		} else{

			// placeholder array for font collection
			$this->font_collection = array();

			// loop through typecase font collection
			foreach( $fonts as $font ){

				$family = explode( "|",$font[0] );
				$family = $family[0];

				// add each font family to font options array
				$this->font_collection[$family] = $family;
			}

		}

		// load customizer actions
		add_action( 'admin_menu', array( &$this, 'theme_font_customizer_menu' ) );
		add_action( 'customize_register', array( &$this, 'theme_font_customizer' ) );
		add_action( 'wp_head',array( &$this, 'add_selectors' ) );

	}

	/**
	* Initializes the Typecase_Customizer() class
	*
	* Checks for an existing Typecase_Customizer() instance
	* and if it doesn't find one, creates it.
	*
	* @uses Typecase_Customizer()
	*
	*/
	public function &init() {

		static $instance = false;

		if ( !$instance ) {

			$instance = new Typecase_Customizer();

		}

		return $instance;
	}

	/**
	* Check for theme font location( s ) declarations from
	* add_theme_support( 'typecase', $font_locations );
	*
	* Returns false if no typecase theme support or theme font locations array is not passed
	*
	* @uses get_theme_support
	*
	*/
	private function get_theme_font_locations(){

		// does the theme support typecase?
		$theme_support = get_theme_support( 'typecase' );

		// return false if no theme support for typecase
		if( $theme_support === false ){

			return false;

		}

		// return false if no theme support doesn't return an array or it's empty
		if( !is_array( $theme_support ) || empty( $theme_support ) ){

			return false;

		}

		// return false if no arguments passed
		if( !isset( $theme_support[0] ) || !is_array( $theme_support[0] ) || empty( $theme_support[0] ) ){

			return false;

		}

		// otherwise return arguments
		return $theme_support[0];

	}

	/**
	* Registers customizer menu for theme fonts if theme support exists
	*
	* @uses \Typecase_Customizer get_theme_font_locations()
	* @uses add_theme_page()
	*
	*/
	public function theme_font_customizer_menu() {

		// get theme font locations
		$theme_font_locations = $this->theme_font_locations;

		// bail if no theme font locations
		if( $theme_font_locations === false ){

			return;

		}

		add_theme_page( 'Theme Fonts', 'Theme Fonts', 'edit_theme_options', 'customize.php' );
	}

	/**
	* Adds option sections for theme fonts in customizer
	*
	* @uses \Typecase_Customizer get_theme_font_locations
	* @uses get_option()
	* @uses $wp_customize ( instance of WP_Customize_Manager )
	*
	*/
	public function theme_font_customizer( $wp_customize ) {

		$customizer_input_file = dirname( TYPECASE_FILE ) . '/customizer-inputs.php';

		if( file_exists( $customizer_input_file ) ){
			require_if_theme_supports( 'typecase', $customizer_input_file );
		}

		// get theme font locations
		$theme_font_locations = $this->theme_font_locations;

		// get typecase font collection
		$font_collection = $this->font_collection;

		// bail if no theme font locations or typecase fonts
		if( $theme_font_locations == false || $font_collection == false ){

			// add theme fonts section to customizer
			$wp_customize->add_section( 
				'theme_fonts',
				array( 
					'title' => 'Theme Fonts',
					'description' => 'Your theme supports Typecase for custom fonts. Before you can add custom fonts, you need to first <a href="' . get_admin_url() . 'admin.php?page=typecase">select font families</a>.',
					'priority' => 35,
				)
			);

			// add the default setting
			$wp_customize->add_setting( 
				'awesome',
				array( 
					'default' => Test,
				)
			);

			// add select option for font location to theme fonts customizer section
			$wp_customize->add_control( 
				'awesome',
				array( 
					'type' => 'select',
					'label' => 'Test',
					'section' => 'theme_fonts',
					// select options are default and what is available in typecase collection
				)
			);

			return;

		}

		$show_advanced = get_theme_mod( 'show_advanced_fonts', false );

		$advanced_fonts = false;

		// loop through each theme font location
		foreach( $theme_font_locations as $i => $theme_font_location ){

			// create a unique slug
			$slug = sanitize_title( $theme_font_location['label'] );

			// store the slug in the main array
			$theme_font_locations[$i]['slug'] = $slug;

			$this->select_ids[$slug] = $theme_font_location['selector'];

			if( isset( $theme_font_location['advanced'] ) && $theme_font_location['advanced'] == true ){
				$advanced_fonts = true;
			}

			// stash customizer font
			$customizer_font = get_theme_mod( $slug, $theme_font_location['default'] );

			// if current customizer font is not in typcase collection
			if( !in_array( $customizer_font, $font_collection ) ){

				// set customizer option to default font
				set_theme_mod( $slug, $theme_font_location['default'] );

			}

			// if current customizer font is advanced and show advanced is false reset to default
			if( $theme_font_location['advanced'] && ! $show_advanced ){

				// set customizer option to default font
				set_theme_mod( $slug, $theme_font_location['default'] );

			}

		}

		// if we have advanced fonts show the advanced fonts checkbox 
		if( $advanced_fonts ){
			// add theme fonts section to customizer
			$wp_customize->add_section( 
				'theme_fonts',
				array( 
					'title' => 'Theme Fonts',
					'description' => 'Make sure to <a href="' . get_admin_url() . 'admin.php?page=typecase" target="_blank">edit available font families</a>.',
					'priority' => 35,
				)
			);

			$wp_customize->add_setting(
				'show_advanced_fonts',
				array( 'transport' => 'postMessage' )
			);

			$wp_customize->add_control(
				'show_advanced_fonts',
				array(
					'type' => 'checkbox',
					'label' => 'Show Advanced Font Locations',
					'section' => 'theme_fonts',
				)
			);
		}

		$i = 1;

		// loop through each theme font location
		foreach( $theme_font_locations as $theme_font_location ){

			// get the unique slug
			$slug = $theme_font_location['slug'];

			// add the default setting
			$wp_customize->add_setting( 
				$slug,
				array( 
					'default' => $theme_font_location['default'],
				)
			);

			$default = array( $theme_font_location['default'] => $theme_font_location['default'] . ' (default)' );

			// add select option for font location to theme fonts customizer section
			$wp_customize->add_control(
				new Typecase_Font_Location_Dropdown_Custom_Control (
					$wp_customize,
					$slug,
					array( 
						'advanced' => $theme_font_location['advanced'],
						'label' => $theme_font_location['label'],
						'section' => 'theme_fonts',
						// select options are default and what is available in typecase collection
						'choices' => array_merge( $default, $font_collection ),
						'show-advanced' => $show_advanced,
						'selector' => $theme_font_location['selector'],
						'default' => $theme_font_location['default'],
						'print-js' => ( $i == count( $theme_font_locations ) ? true : false ),
					)
				)
			);

			$i++;

		}

	}

	/**
	* Adds customizer theme font CSS selectors to head
	*
	* @uses Typecase_Customizer->get_theme_font_locations
	* @uses sanitize_title
	* @uses get_theme_mod
	*
	*/
	public function add_selectors(){

		// get theme font locations
		$theme_font_locations = $this->theme_font_locations;

		// bail if no theme font locations
		if( $theme_font_locations === false ){

			return;

		}

		// placeholder array for CSS styles
		$styles = array();

		// get typecase font collection
		$font_collection = $this->font_collection;

		// bail if no fonts in collection
		if( $font_collection == false ){
			return;
		}

		// stash show advanced
		$show_advanced = get_theme_mod( 'show_advanced_fonts', false );

		// loop through each theme font location
		foreach( $theme_font_locations as $theme_font_location ){

			// create a unique slug
			$slug = sanitize_title( $theme_font_location['label'] );

			// stash customizer font
			$customizer_font = get_theme_mod( $slug, $theme_font_location['default'] );

			// skip if this is an advanced location and advanced option is turned off
			if( $theme_font_location['advanced'] == true && $show_advanced == false ){
				continue;
			}

			// if customizer font is different than the default font AND in the typecase collection
			if( $customizer_font != $theme_font_location['default'] && in_array( $customizer_font, $font_collection ) ){

				// add the styles
				$styles[] = $theme_font_location['selector'] . '{ font-family: "' . $customizer_font . '"; }';

			}

		}

		// if we have some styles other than defaults
		if( !empty( $styles ) ){

			// print them out
			echo '<style type="text/css">' . "\n\t" . implode( "\n\t", $styles ) . "\n" . '</style>' . "\n" . '<!--==-- End Theme Font Declarations --==-->' . "\n";

		}
	}

}

$typecase_get_theme_font_locations = Typecase_Customizer::init();