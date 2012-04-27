<?php
/*
Plugin Name: Typecase Pro
Plugin URI: http://upthemes.com
Description: A plugin that makes it dead simple to add custom webfonts to your website.
Version: 0.3.4
Author: UpThemes
Author URI: http://upthemes.com
License: GPL2
*/

// don't call the file directly
if ( !defined( 'ABSPATH' ) )
	return;

/**
 * Typecase class
 *
 * @class Typecase	The class that holds the entire Typecase plugin
 */
class Typecase {

	/**
	 * @var $name				Variable for Typecase used throughout the plugin
	 */
	protected $name = "Typecase";

	/**
	 * @var $api_url		Our google web font URL
	 */
	protected $api_url = "http://fonts.googleapis.com/css?family=";

	/**
	 * @var $nonce_key	A security key used internally by the plugin
	 */
	protected $nonce_key = '+Y|*Ec/-\s3';

	/**
	 * PHP 5.3 and lower compatibility
	 *
	 * @uses Typecase::__construct()
	 *
	 */
	public function Typecase(){
		$this->__construct();
	}

	/**
	 * Constructor for the Typecase class
	 *
	 * Sets up all the appropriate hooks and actions
	 * within our plugin.
	 *
	 * @uses register_activation_hook()
	 * @uses register_deactivation_hook()
	 * @uses is_admin()
	 * @uses add_action()
	 *
	 */
	public function __construct() {
		register_activation_hook( __FILE__, array(&$this, 'activate' ) );
		register_deactivation_hook( __FILE__, array(&$this, 'deactivate' ) );

		add_action('init',array(&$this,'localization_setup'));

		if ( is_admin() ){
			add_action('admin_menu',array(&$this,'admin_menu'));
			add_action('wp_ajax_saveFonts',array(&$this,'ajax_save_fonts'));
			add_action('wp_ajax_getFonts',array(&$this,'ajax_get_fonts'));
			add_action('wp_ajax_clear_firsttimer',array(&$this,'ajax_clear_firsttimer'));
		}else{
			add_action('wp_head',array(&$this,'display_frontend'));
		}
	}

	/**
	 * Initializes the Typecase() class
	 *
	 * Checks for an existing Typecase() instance 
	 * and if it doesn't find one, creates it.
	 *
	 * @uses Typecase()
	 *
	 */
	public function &init() {
		static $instance = false;

		if ( !$instance ) {
			$instance = new Typecase();
		}

		return $instance;
	}
	
	/**
	 * AJAX function for saving fonts
	 *
	 *
	 * @uses Typecase::verify_nonce() 
	 * @uses update_option()
	 * @uses json_encode()
	 * @uses header()
	 * @return JSON object with fonts and font metadata
	 *
	 */
	public function ajax_save_fonts(){

		$nonce_verify = $this->verify_nonce($_REQUEST['_nonce']);
		
		// get the submitted parameters
		$fonts = $_REQUEST['json'];

		$verified = $nonce_verify ? true : false;

		$fonts = update_option('typecase_fonts',$fonts);
		
		$new_nonce = array( 'nonce' => wp_create_nonce($this->nonce_key) );

		$response = json_encode( array( '_new_nonce' => $new_nonce, 'success' => $verified, 'fonts' => $fonts ) );

		header( "Content-Type: application/json" );
		echo $response;

		exit;

	}
	
	/**
	 * AJAX function for retrieving fonts
	 *
	 *
	 * @uses Typecase::verify_nonce() 
	 * @uses get_option()
	 * @uses json_encode()
	 * @uses header()
	 * @return JSON object with fonts and font metadata
	 *
	 */
	public function ajax_get_fonts(){
		
		$this->verify_nonce($_GET['_nonce']);

		$fonts = get_option('typecase_fonts');

		$gotten = $fonts ? true : false;

		$new_nonce = array( 'nonce' => wp_create_nonce($this->nonce_key) );

		$response = json_encode( array( '_new_nonce' => $new_nonce, 'success' => $gotten, 'fonts' => $fonts ) );

		header( "Content-Type: application/json" );
		echo $response;

		exit;

	}

	/**
	 * AJAX function to remove yellow instructional box
	 *
	 * @uses Typecase::verify_nonce() 
	 * @uses update_option()
	 * @uses json_encode()
	 * @uses header()
	 * @return JSON object with fonts and font metadata
	 *
	 */
	public function ajax_clear_firsttimer(){
		
		$this->verify_nonce($_GET['_nonce']);

		$firsttimer_update = update_option('typecase_firsttimer','disabled');

		$new_nonce = array( 'nonce' => wp_create_nonce($this->nonce_key) );

		$response = json_encode( array( '_new_nonce' => $new_nonce, 'success' => $firsttimer_update ) );

		header( "Content-Type: application/json" );
		echo $response;

		exit;

	}

	/**
	 * Placeholder for activation function
	 *
	 * Nothing being called here yet.
	 */
	public function activate() {}

	/**
	 * Placeholder for deactivation function
	 *
	 * Nothing being called here yet.
	 */
	public function deactivate() {}

	/**
	 * Initialize plugin for localization
	 *
	 * @uses load_plugin_textdomain()
	 *
	 */
	public function localization_setup() {
		load_plugin_textdomain( 'typecase', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}

	/**
	 * Initialize admin menu
	 *
	 * @uses Typecase::load_menu()
	 *
	 */
	public function admin_menu() {
		$this->load_menu();
	}

	/**
	 * Initialize admin menu
	 *
	 * @uses Typecase::load_menu()
	 *
	 */
	public function load_menu() {
		$hook = add_menu_page( $this->name, $this->name, 'manage_options', 'typecase', array(&$this, 'ui' ), plugins_url( 'images/ico_typecase.png', __FILE__ ) );
		add_action( 'admin_print_styles-' . $hook, array($this,'admin_styles'));
	}

	/**
	 * Enqueue admin styles and scripts
	 *
	 * Also creates a nonce for saving font data.
	 *
	 * @uses current_user_can()
	 * @uses wp_create_nonce()
	 * @uses wp_enqueue_script()
	 * @uses wp_enqueue_style()
	 * @uses wp_localize_script()
	 *
	 */
	public function admin_styles() {
		if ( !current_user_can( 'manage_options' ) )
			return;

		$nonce = array(  );

		wp_enqueue_script('json2');
		wp_enqueue_script('selectivizr', plugins_url( 'scripts/selectivizr-min.js', __FILE__ ), array('json2'), date( 'Ymd' ) );
		wp_enqueue_script('google-api', 'https://www.google.com/jsapi', array('selectivizr'), date( 'Ymd' ) );
		wp_enqueue_script('typecase', plugins_url( 'scripts/main.js', __FILE__ ), array('jquery','google-api'), date( 'Ymd' ) );
		wp_enqueue_style('typecase', plugins_url( 'styles/main.css', __FILE__ ), false, date( 'Ymd' ) );
		wp_enqueue_style('journal-font', plugins_url( 'fonts/journal/journal.css', __FILE__ ), false, date( 'Ymd' ) );

		wp_localize_script( 'typecase', 'typecase', array( 'nonce' => wp_create_nonce($this->nonce_key), 'loading_gif' => plugins_url( 'images/loading.gif', __FILE__ ) ) );
	}

	/**
	 * Creates the user interface markup
	 *
	 * Also contains strings that are being localized.
	 *
	 * @uses __()
	 * @uses get_option()
	 * @uses apply_filters()
	 *
	 */
	public function ui(){
	
		if( !current_user_can('manage_options') )
			return;
	
		$title 							= __('Typecase','typecase');
		$tagline 						= __('Beautiful web fonts for WordPress','typecase');
		$collection 				= __('Your Collection','typecase');
		$nofonts 						= __('You have no fonts in your collection!','typecase');
		$addfonts 					= sprintf( __('Browse the "Available Fonts" below and click %s to add fonts here.','typecase'), '<span class="add"><span></span></span>' );
		$selectors					= __('Selectors','typecase');
		$newselector				= __('New Selector...','typecase');
		$includedvariants 	= __('Included Variants','typecase');
		$charactersets		 	= __('Character Sets','typecase');
		$availablefonts			= __('Available Fonts','typecase');
		$noresultstitle			= __('No Results!','typecase');
		$searchgoogle				= __('Search Google Webfonts','typecase');
		$noresultsdesc			= __('There are no fonts with that name in the Google Font Library.','typecase');
		$showmorefonts			= __('Load More Fonts','typecase');
		$copyright					= sprintf( __("Copyright %s <a href=\"http://upthemes.com\">UpThemes</a>. All Rights Reserved.","typecase"), date('Y') );
		$welcome						= __("Welcome! Here’s the rundown on using typecase.","typecase");
		$step_1							= __("Browse or search for fonts in the \"Available Fonts\" box","typecase");
		$step_2							= sprintf(__("Click the %s icon to add the font to \"Your Collection\"","typecase"),'<span class="add"><span></span></span>');
		$step_3							= __("Add CSS selectors and font weights in the right column","typecase");
		$hidehelp_btn				= __("Close &amp; Don't Show Again","typecase");

		$firsttimer = '';

		if( isset($_GET['front_end_editor']) || get_option('typecase_firsttimer') != 'disabled' ){

			$firsttimer = '
			<div id="firsttimer">
				<h1>' . $welcome . '</h1>
				<ol>
					<li><span class="list-item"></span><strong>' . $step_1 . '</strong></li>
					<li><span class="list-item"></span><strong>' . $step_2 . '</strong></li>
					<li><span class="list-item"></span><strong>' . $step_3 . '</strong></li>
				</ol>
				<div class="buttons">
					<a id="kill" class="typecase-btn primary large" href="">' . $hidehelp_btn . '</a>
				</div>
			</div>';

		}

		$classname = '';
		$front_end_editor_ui = '';
		$buttons = '<div class="buttons"><span>' . __("live front-end editor &amp; lifetime support","typecase") . '</span> <a class="typecase-btn primary" href="http://upthemes.com/plugins/typecase/" target="_blank">' . __("Upgrade to Pro","typecase") . '</a></div>';

		$classname = apply_filters('typecase-classname',$classname);
		$buttons = apply_filters('typecase-buttons',$buttons);
		$front_end_editor = apply_filters('typecase-front-end-editor',$front_end_editor_ui);

		echo <<<EOT
		<div id="typecase"$classname>
			<header id="masthead">
				<h1>
					<strong>$title</strong>
					<span>$tagline</span>
					$buttons
				</h1>
			</header>
			$firsttimer
			$front_end_editor
			<div id="your-collection-wrap">
			<iframe></iframe>
		  <div id="your-collection">
		    <header>
		      <h1>$collection</h1>
		    </header><!--/header-->
		    <div class="content-wrap">
		      <div class="no-fonts">
		      	<div class="no-fonts-content">
			        <h2>$nofonts</h2>
			        <h4>$addfonts</h4>
		        </div><!--/.no-fonts-content-->
		      </div><!--/.no-fonts-->
		      <div class="font-list-wrap">
		        <div class="font-list">
		        </div><!--/.font-list-->
		      </div><!--/.font-list-wrap-->
		      <div class="sidebar">
		        <h2>$selectors</h2>
		        <ul id="selectors">
		          <li class="add-new">
		            <form id="new-selector-form">
		              <input type="text" name="new-selector" id="new-selector" placeholder="$newselector"/>
		              <input type="submit" id="submit-selector" value=""/>
		            </form>
		          </li>
		          <span class="new-selector-width"></span>
		        </ul><!--/#selectors-->
		        <div class="clear"></div>
		        <h2>$includedvariants</h2>
		        <form id="variants-form"></form>
		        <h2>$charactersets</h2>
		        <form id="subsets-form"></form>
		        <button id="save-fonts" class="typecase-btn primary">Save Fonts</button>
		      </div><!--/.sidebar-->
		      <div class="clear"></div>
		    </div><!--/.content-wrap-->
		  </div><!--/#your-collection-->
		  <span class="arrow-down"></span>
		  </div><!--/#your-collection-wrap-->
		  <div id="available-fonts-wrap">
		  <iframe></iframe>
		  <div id="available-fonts">
		    <header>
		      <h1>$availablefonts</h1>
		    </header><!--/header-->
		    <form id="search">
		      <input type="text" name="search-input" id="search-input" placeholder="$searchgoogle"/>
		      <input type="submit" id="search-submit" value=""/>
		    </form><!--/#search-->
		    <div class="content-wrap">
		      <div class="font-list-wrap">
		        <div class="no-results">
		        	<div class="no-results-content">
			          <h2>$noresultstitle</h2>
			          <h4>$noresultsdesc</h4>
		         	</div><!--/.no-results-content-->
		        </div><!--/.no-results-->
		        <div class="font-list" id="loaded-fonts">
		        </div><!--/.font-list#loaded-fonts-->
		        <div class="font-list" id="search-results">
		        </div><!--/.font-list#search-results-->
		      </div><!--/.font-list-wrap-->
		    </div><!--/.content-wrap-->
		    <a id="more-fonts" class="typecase-btn primary" href=""><span>$showmorefonts</span></a>
		  </div><!--/#available-fonts-->
		  <span class="arrow-down"></span>
		  </div><!--/#available-fonts-wrap-->
		</div><!--/#typecase-->
		<div class="typecase_copyright">$copyright <a id="upthemes" href="http://upthemes.com">UpThemes</a></div>
EOT;
	}

	/**
	 * Displays CSS on the front-end for web fonts
	 *
	 * The font data array is parsed and we load in the required
	 * weights, variants, and characters sets.
	 *
	 * @uses get_option()
	 * @uses get_option()
	 * @uses apply_filters()
	 *
	 * @todo Parse and load variants properly.
	 * @todo Parse and load charsets at all.
	 *
	 */
	public function display_frontend(){
		$fonts = get_option('typecase_fonts');

		if( $fonts[0] ){

			$apiUrl = &$this->api_url;
			$import_url = '';
			$font_styles = '';
			$font_weights = '';

			foreach($fonts as $font){

				$family = explode("|",$font[0]);
				$family = $family[0];
				$selectors = substr( $font[1], 1);
				$weights = substr( $font[2], 1);

				$weights = explode("|",$weights);

				foreach( $weights as $i => $weight ){
					$pos = strpos($weight, '-');
					$weight = mb_substr($weight,0,$pos);
					if($i>0)
						$font_weights .= ",";
					else
						$font_weights .= ":";
					$font_weights .= $weight;
				}

				if( $import_url != '' )
					$import_url .= '|';

				$import_url .= str_replace(" ","+",$family).$font_weights;

				$selectors = explode("|",$selectors);

				foreach( $selectors as $i => $selector){
					if($i>0)
						$font_styles .= ",";
					$font_styles .= $selector;
				}

				$font_styles .= "{ font-family: \"$family\"; }\n";

			}

			$import_fonts = "@import url($apiUrl$import_url);\n";

			echo "\n\n<!--====== Typecase Font Declarations ======-->";
			echo "\n<style type=\"text/css\">\n";
			echo $import_fonts;
			echo $font_styles;
			echo "</style>\n";
			echo "<!--==-- End Typecase Font Declarations --==-->\n\n";

		}
	}

	/**
	 * Verify nonces against our $nonce_key var
	 *
	 * @uses esc_attr()
	 * @uses wp_verify_nonce()
	 *
	 */
	protected function verify_nonce($nonce){
		$nonce = esc_attr($nonce);
		if(! wp_verify_nonce($nonce, $this->nonce_key))
			die('Security check failed.');
		else
			return true;
	}

}

/**
 * Bootstrap Typecase Pro, if it exists.
 *
 * @uses file_exists()
 * @uses dirname()
 * @uses Typecase::init()
 *
 */
if( file_exists( dirname(__FILE__) . '/pro.php' ) ){
	include_once(dirname(__FILE__) . '/pro.php');
}else{
	$typecase = Typecase::init();
}
