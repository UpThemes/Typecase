<?php
/*
Plugin Name: FontEasy
Plugin URI: http://upthemes.com
Description: A plugin that makes it dead simple to add custom webfonts to your website.
Version: 0.1
Author: Chris Wallace
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

		if ( is_admin() )
			add_action('admin_menu',array($this,'admin_menu') );

	}

	function &init() {
		static $instance = false;

		if ( !$instance ) {
			$instance = new FontEasy();
		}

		return $instance;
	}

	function activate( $network_wide ) {
		$type = $network_wide ? 'network' : 'single';
		$this->update_option( 'activated', $type );
	}

	function deactivate() {
		if ( $this->is_registered() )
			$this->contact_service( 'plugin_status', array( 'vp_plugin_status' => 'deactivated' ) );
	}

	function get_option( $key ) {

		if ( isset( $this->options[$key] ) )
			return $this->options[$key];

		return false;
	}

	function update_option( $key, $value ) {
		$this->options[$key] = $value;
		$this->update_options();
	}

	function delete_option( $key ) {
		unset( $this->options[$key] );
		$this->update_options();
	}

	function update_options() {
		update_option( $this->option_name, $this->options );
	}

	function admin_init() {
		if ( !current_user_can( 'manage_options' ) )
			return;

		load_plugin_textdomain( 'fonteasy', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}

	function admin_head() {
		if ( !current_user_can( 'manage_options' ) )
			return;

	}

	function admin_menu() {
		$this->load_menu();
	}

	function load_menu() {

		$hook = add_menu_page( $this->name, $this->name, 'manage_options', 'fonteasy', array( $this, 'ui' ), plugins_url( 'assets/ico_fonteasy.png', __FILE__ ) );

		add_action( 'admin_print_styles-' . $hook, array($this,'admin_styles'));

	}

	function admin_styles() {
//		wp_enqueue_style('wpfb-admin', plugins_url( 'styles/wpfb-admin.css', __FILE__ ), false, WPFB_VERSION );	
		wp_enqueue_script('google-api', 'https://www.google.com/jsapi', array('jquery'), date( 'Ymd' ) );
		wp_enqueue_script('fonteasy', plugins_url( 'main.js', __FILE__ ), array('jquery','google-api'), date( 'Ymd' ) );
		wp_enqueue_style('fonteasy', plugins_url( 'main.css', __FILE__ ), false, date( 'Ymd' ) );
	}
	
	function ui(){

		echo <<<EOT
		<div id="fonteasy">
			<form action="" method="post">
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
				        <span class="new-selector-width"></span>
				        <li class="add-new">
				          <form id="new-selector-form">
				            <input type="text" name="new-selector" id="new-selector" placeholder="New Selector..."/>
				          </form>
				        </li>
				      </ul><!--/#selectors-->
				      <h2>Included Styles</h2>
				      <label for="style-1">
				        <input type="checkbox" name="style" id="style-1"/>Normal
				      </label>
				      <label for="style-2">
				        <input type="checkbox" name="style" id="style-2" checked="true"/>Bold
				      </label>
				    </div><!--/.sidebar-->
				  </div><!--/.content-wrap-->
				</div><!--/#your-collection-->
				<div id="available-fonts">
				  <div class="header">
				    <h1>Available Fonts</h1>
				  </div><!--/.header-->
				  <form id="search">
				    <input type="text" name="search-input" id="search-input" placeholder="Search Google Web Font Library..."/>
				    <input type="submit" value=""/>
				  </form><!--/#search-->
				  <div class="content-wrap">
				    <div class="font-list-wrap">
				      <div class="font-list">
				        
				      </div><!--/.font-list-->
				    </div><!--/.font-list-wrap-->
				    <a href="#more-fonts"><span>Browse More Fonts</span></a>
				  </div><!--/.content-wrap-->
				</div><!--/#available-fonts-->
			</form>
		</div>
EOT;

	}

}

$fonteasy = FontEasy::init();

/*		
EOT; */