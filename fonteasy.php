<?php
/*
Plugin Name: FontEasy
Plugin URI: http://upthemes.com
Description: A plugin that makes it dead simple to add custom webfonts to your website.
Version: 0.1
Author: UpThemes
Author URI: http://upthemes.com
License: GPL2
*/

// don't call the file directly
if ( !defined( 'ABSPATH' ) )
	return;

class FontEasy {

	var $name = "FontEasy";

	function FontEasy(){
		$this->__construct();
	}

	function __construct() {
		register_activation_hook( __FILE__, array( $this, 'activate' ) );
		register_deactivation_hook( __FILE__, array( $this, 'deactivate' ) );

		if ( is_admin() ):
			add_action('admin_menu',array($this,'admin_menu') );
			add_action('wp_ajax_saveFonts',array($this,'ajax_save_fonts'));
			add_action('wp_ajax_getFonts',array($this,'ajax_get_fonts'));
		endif;
	}

	function &init() {
		static $instance = false;

		if ( !$instance ) {
			$instance = new FontEasy();
		}

		return $instance;
	}
	
	function ajax_save_fonts(){

		// get the submitted parameters
		$fonts = $_POST['json'];

		$response_data = update_option('fonteasy_fonts',$fonts);

		$response = json_encode( array( 'success' => true, 'fonts' => $response_data ) );

		header( "Content-Type: application/json" );
		echo $response;

		exit;

	}

	function ajax_get_fonts(){

		$fonts = get_option('fonteasy_fonts');

		$response = json_encode( array( 'success' => true, 'fonts' => $fonts ) );

		header( "Content-Type: application/json" );
		echo $response;

		exit;

	}

	function activate( $network_wide ) {
		$type = $network_wide ? 'network' : 'single';
		$this->update_option( 'activated', $type );
	}

	function deactivate() {
	}

	function admin_init() {
		if ( !current_user_can( 'manage_options' ) )
			return;

		load_plugin_textdomain( 'fonteasy', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}

	function admin_head() {

	}

	function admin_menu() {
		$this->load_menu();
	}

	function load_menu() {

		$hook = add_menu_page( $this->name, $this->name, 'manage_options', 'fonteasy', array( $this, 'ui' ), plugins_url( 'assets/ico_fonteasy.png', __FILE__ ) );

		add_action( 'admin_print_styles-' . $hook, array($this,'admin_styles'));

	}

	function admin_styles() {

		if ( !current_user_can( 'manage_options' ) )
			return;

		wp_enqueue_script('json2', plugins_url( 'json2.js', __FILE__ ), array('jquery'), date( 'Ymd' ) );
		wp_enqueue_script('selectivizr', plugins_url( 'selectivizr-min.js', __FILE__ ), array('json2'), date( 'Ymd' ) );
		wp_enqueue_script('google-api', 'https://www.google.com/jsapi', array('selectivizr'), date( 'Ymd' ) );
		wp_enqueue_script('fonteasy', plugins_url( 'main.js', __FILE__ ), array('jquery','google-api'), date( 'Ymd' ) );
		wp_enqueue_style('fonteasy', plugins_url( 'main.css', __FILE__ ), false, date( 'Ymd' ) );
	}

	function ui(){

		echo <<<EOT
		<div id="fonteasy">
		  <div id="your-collection">
		    <div class="header">
		      <h1>Your Collection</h1>
		    </div><!--/.header-->
		    <div class="content-wrap">
		      <div class="no-fonts">
		        <h2>You have no fonts in your Library!</h2>
		        <h4>Browse below and click <span class="add"><span></span></span> to add fonts to your library.</h4>
		      </div><!--/.no-fonts-->
		      <div class="font-list-wrap">
		        <div class="font-list">
		        </div><!--/.font-list-->
		      </div><!--/.font-list-wrap-->
		      <div class="sidebar">
		        <h2>Selectors</h2>
		        <ul id="selectors">
		          <li class="add-new">
		            <form id="new-selector-form">
		              <input type="text" name="new-selector" id="new-selector" placeholder="New Selector..."/>
		              <input type="submit" id="submit-selector" value=""/>
		            </form>
		          </li>
		          <span class="new-selector-width"></span>
		        </ul><!--/#selectors-->
		        <div class="clear"></div>
		        <h2>Included Variants</h2>
		        <form id="variants-form">
		        </form>
		      </div><!--/.sidebar-->
		      <div class="clear"></div>
		    </div><!--/.content-wrap-->
		  </div><!--/#your-collection-->
		  <div id="available-fonts">
		    <div class="header">
		      <h1>Available Fonts</h1>
		    </div><!--/.header-->
		    <form id="search">
		      <input type="text" name="search-input" id="search-input" placeholder="Search Google Web Font Library..."/>
		      <input type="submit" id="search-submit" value=""/>
		    </form><!--/#search-->
		    <div class="content-wrap">
		      <div class="font-list-wrap">
		        <div class="no-results">
		          <h2>No Results!</h2>
		          <h4>There are no fonts with that name in the Google Font Library.</h4>
		        </div><!--/.no-results-->
		        <div class="font-list" id="loaded-fonts">
		        </div><!--/.font-list#loaded-fonts-->
		        <div class="font-list" id="search-results">
		        </div><!--/.font-list#search-results-->
		      </div><!--/.font-list-wrap-->
		      <a class="more-fonts"><span>Browse More Fonts</span></a>
		    </div><!--/.content-wrap-->
		  </div><!--/#available-fonts-->
		</div><!--/#fonteasy-->
EOT;

	}

}

$fonteasy = FontEasy::init();