<?php
// don't call the file directly
if ( !defined( 'ABSPATH' ) ){
	return;
}

function testing(){
			// get typecase fonts
		$fonts = get_option( 'typecase_fonts' );

		if( $fonts )
			echo "AWESEDSDSDASDASDASDASDASDSADA<br>AADWDASDASDASDASDSASADA";

}

add_action( 'wp_head', 'testing' );

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
		$theme_font_locations = $this->get_theme_font_locations();

		// bail if no theme font locations
		if( $theme_font_locations === false ){
			return;
		}

		// load customizer actions
		add_action( 'admin_menu', array(&$this, 'theme_font_customizer_menu') );
		add_action( 'customize_register', array(&$this, 'theme_font_customizer') );
		add_action( 'wp_head',array(&$this,'add_selectors') );

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
	 * Check for theme font location(s) declarations from
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

		// bail if no theme support
		if( $theme_support === false ){
			return false;
		}

		// bail if no theme support doesn't return an array or it's empty
		if( !is_array($theme_support) || empty($theme_support) ){
			return false;
		}

		// bail if no arguments passed
		if( !isset($theme_support[0]) || !is_array($theme_support[0]) || empty($theme_support[0]) ){
			return false;
		}

		// otherwise return arguments
		return $theme_support[0];

	}

	/**
	 * Registers customizer menu for theme fonts if theme support exists
	 *
	 * @uses Typecase_Cuztomizer->get_theme_font_locations
	 * @uses add_theme_page
	 *
	 */
	public function theme_font_customizer_menu() {
		// get theme font locations
		$theme_font_locations = $this->get_theme_font_locations();

		// bail if no theme font locations
		if( $theme_font_locations === false ){
			return;
		}

		add_theme_page( 'Theme Fonts', 'Theme Fonts', 'edit_theme_options', 'customize.php' );
	}

	/**
	 * Adds option sections for theme fonts in customzer
	 *
	 * @uses Typecase_Cuztomizer->get_theme_font_locations
	 * @uses get_option
	 * @uses $wp_customize (instance of WP_Customize_Manager)
	 *
	 */
	function theme_font_customizer( $wp_customize ) {
		// get theme font locations
		$theme_font_locations = $this->get_theme_font_locations();

		// get typecase fonts
		$fonts = get_option( 'typecase_fonts' );

		// bail if no theme font locations or typecase fonts
		if( $theme_font_locations == false || $fonts == false){

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

			// add select option for font location to theme fonts customzer section
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

		// add theme fonts section to customizer
		$wp_customize->add_section(
			'theme_fonts',
			array(
				'title' => 'Theme Fonts',
				'description' => 'Make sure to <a href="' . get_admin_url() . 'admin.php?page=typecase" target="_blank">edit available font families</a>.',
				'priority' => 35,
			)
		);

		// placeholder array for typecase font options
		$font_options = array();

		// loop through typecase font collection
		foreach( $fonts as $font ){

			$family = explode("|",$font[0]);
			$family = $family[0];

			// add each font family to font options array
			$font_options[$family] = $family;
		}

		// loop through each theme font location
		foreach( $theme_font_locations as $theme_font_location ){
			// create a unique slug
			$slug = sanitize_title($theme_font_location['label']);

			// add the default setting
			$wp_customize->add_setting(
				$slug,
				array(
					'default' => $theme_font_location['default'],
				)
			);

			$default = array( $theme_font_location['default'] => $theme_font_location['default'] . ' (default)' );

			// add select option for font location to theme fonts customzer section
			$wp_customize->add_control(
				$slug,
				array(
					'type' => 'select',
					'label' => $theme_font_location['label'],
					'section' => 'theme_fonts',
					// select options are default and what is available in typecase collection
					'choices' => array_merge($default, $font_options),
				)
			);

		}
	}

	/**
	 * Adds customizer theme font CSS selectors to head
	 *
	 * @uses Typecase_Cuztomizer->get_theme_font_locations
	 * @uses sanitize_title
	 * @uses get_theme_mod
	 *
	 */
	public function add_selectors(){
		// get theme font locations
		$theme_font_locations = $this->get_theme_font_locations();

		// bail if no theme font locations
		if( $theme_font_locations === false ){
			return;
		}

		// placeholder array for CSS styles
		$styles = array();

		// loop through each theme font location
		foreach( $theme_font_locations as $theme_font_location ){
			// create a unique slug
			$slug = sanitize_title($theme_font_location['label']);

			// stash customizer font
			$customizer_font = get_theme_mod($slug, $theme_font_location['default']);

			// if customzer font is different than the default font
			if( $customizer_font != $theme_font_location['default'] ){
				// add the styles
				$styles[] = $theme_font_location['selector'] . '{ font-family: "' . $customizer_font . '"; }';
			}

		}

		// if we have some styles other than defaults
		if( !empty($styles) ){
			// print them out
			echo '<style type="text/css">' . "\n\t" . implode("\n\t", $styles) . "\n" . '</style>' . "\n" . '<!--==-- End Theme Font Declarations --==-->' . "\n";
		}
	}

}

$typecase_get_theme_font_locations = Typecase_Customizer::init();