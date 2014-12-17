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
	protected $all_theme_font_locations = array();

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
		add_action( 'customize_controls_enqueue_scripts', array( &$this, 'customizer_live_preview' ) );

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

		$wp_customize->add_panel( 'theme_fonts', array(
			'priority' => 35,
			'capability' => 'edit_theme_options',
			'theme_supports' => 'typecase',
			'title' => 'Theme Fonts',
			'description' => 'Make sure to <a href="' . get_admin_url() . 'admin.php?page=typecase" target="_blank">edit available font families</a>.',
		) );
		
		// add theme fonts section to customizer
		$wp_customize->add_section( 
			'theme_fonts_main',
			array( 
				'title' => 'Options',
				'description' => 'Make sure to <br /><a href="' . get_admin_url() . 'admin.php?page=typecase" target="_blank">edit available font families</a>.',
				'priority' => 1,
				'panel' => 'theme_fonts',
			)
		);

		$has_panel = false;
		
		if( isset( $theme_font_locations['simple'] ) ){
			
			$this->display_inputs( $theme_font_locations['simple'], $wp_customize );
			$has_panel = true;
			
		}
		
		if( isset( $theme_font_locations['advanced'] ) ){
			
			foreach( $theme_font_locations['advanced'] as $section => $theme_font_section_locations ){
				
				// add theme fonts section to customizer
				$wp_customize->add_section( 
					'theme_fonts_' . $section,
					array( 
						'title' => ucwords( $section ),
						'description' => '',
						'priority' => 10,
						'panel' => 'theme_fonts',
					)
				);
				
				$this->display_inputs( $theme_font_section_locations, $wp_customize, $section );
				$has_panel = true;
				
			}
			
		}
			
		if( !$has_panel ){
			$this->display_inputs( $theme_font_locations, $wp_customize );
		} else{
			$wp_customize->add_setting(
				'show_advanced_fonts',
				array( 'transport' => 'postMessage' )
			);
	
			$wp_customize->add_control(
				'show_advanced_fonts',
				array(
					'type' => 'checkbox',
					'label' => 'Show Advanced Font Locations',
					'section' => 'theme_fonts_main',
				)
			);
		}

	}
	/*
	 * Function for displaying section inputs
	 */
	public function display_inputs( $font_locations, $wp_customize, $section = 'main', $is_advanced = false ){
		$i = 1;
		
		// get typecase font collection
		$font_collection = $this->font_collection;
		
		// get show advanced setting
		$show_advanced = get_theme_mod( 'show_advanced_fonts', false );
		
		// loop through each theme font location
		foreach( $font_locations as $i => $font_location ){
			
			// create a unique slug
			$slug = sanitize_title( $font_location['label'] );

			// stash customizer font
			$customizer_font = get_theme_mod( $slug, $font_location['default'] );

			// if current customizer font is not in typcase collection
			if( !in_array( $customizer_font, $font_collection ) ){

				// set customizer option to default font
				set_theme_mod( $slug, $font_location['default'] );

			}

			// if current customizer font is advanced and show advanced is false reset to default
			if( $is_advanced && ! $show_advanced ){

				// set customizer option to default font
				set_theme_mod( $slug, $font_location['default'] );

			}
			
			// add the default setting
			$wp_customize->add_setting( 
				$slug,
				array( 
					'default' => $font_location['default'],
				)
			);

			$default = array(
				'' => 'Select a Font',
				$font_location['default'] => $font_location['default'] . ' (default)',
			);
			
			$wp_customize->add_control(
				$slug,
				array( 
					'label' => $font_location['label'],
					'type' => 'select',
					'section' => 'theme_fonts_' . $section,
					// select options are default and what is available in typecase collection
					'choices' => array_merge( $default, $font_collection ),
					'default' => $font_location['default'],
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
		$all_theme_font_locations = array();
		$has_panel = false;
		
		if( isset( $theme_font_locations['simple'] ) ){
			
			$all_theme_font_locations = array_merge( $all_theme_font_locations, $theme_font_locations['simple'] );
			
			$has_panel = true;
			
		}
		
		if( isset( $theme_font_locations['advanced'] ) ){
			
			foreach( $theme_font_locations['advanced'] as $section => $theme_font_section_locations ){
				
				$all_theme_font_locations = array_merge( $all_theme_font_locations, $theme_font_section_locations );
				
			}
			
			$has_panel = true;
			
		}
			
		if( !$has_panel ){
			$all_theme_font_locations = $theme_font_locations;
		}
		
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
		foreach( $all_theme_font_locations as $theme_font_location ){

			// create a unique slug
			$slug = sanitize_title( $theme_font_location['label'] );

			// stash customizer font
			$customizer_font = get_theme_mod( $slug, $theme_font_location['default'] );
			
			// skip font if empty (none selected)
			if( empty( $customizer_font ) ){
				continue;
			}
			
			// if customizer font is in the typecase collection OR is the default
			if( in_array( $customizer_font, $font_collection ) || $customizer_font == $theme_font_location['default'] ){

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
	
	/**
	* This outputs the javascript needed to automate the live settings preview.
	*/
	public function customizer_live_preview(){
		wp_enqueue_script( 'typcase-customizer',  plugins_url( 'scripts/customizer.js', __FILE__ ), array( 'jquery','customize-preview' ), false, true );
		wp_localize_script( 'typcase-customizer',  'WPversion', array( (int) get_bloginfo('version') ) );
	}

}

$typecase_get_theme_font_locations = Typecase_Customizer::init();