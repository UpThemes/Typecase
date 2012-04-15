<?php
/*
Plugin Name: Typecase
Plugin URI: http://upthemes.com
Description: A plugin that makes it dead simple to add custom webfonts to your website.
Version: 0.2
Author: UpThemes
Author URI: http://upthemes.com
License: GPL2
*/

// don't call the file directly
if ( !defined( 'ABSPATH' ) )
	return;

class Typecase {

	var $name = "typecase";

	function Typecase(){
		$this->__construct();
	}

	function __construct() {
		register_activation_hook( __FILE__, array( $this, 'activate' ) );
		register_deactivation_hook( __FILE__, array( $this, 'deactivate' ) );

		if ( is_admin() ):
			add_action('admin_menu',array($this,'admin_menu') );
			add_action('wp_ajax_saveFonts',array($this,'ajax_save_fonts'));
			add_action('wp_ajax_getFonts',array($this,'ajax_get_fonts'));
			add_action('wp_ajax_clear_firsttimer',array($this,'ajax_clear_firsttimer'));
		else:
			add_action('wp_head',array($this,'display_frontend'));
		endif;
	}

	function &init() {
		static $instance = false;

		if ( !$instance ) {
			$instance = new Typecase();
		}

		return $instance;
	}
	
	function ajax_save_fonts(){

		// get the submitted parameters
		$fonts = $_POST['json'];

		$response_data = update_option('typecase_fonts',$fonts);

		$response = json_encode( array( 'success' => $response_data ) );

		header( "Content-Type: application/json" );
		echo $response;

		exit;

	}

	function ajax_get_fonts(){

		$fonts = get_option('typecase_fonts');

		$gotten = $fonts ? true : false;

		$response = json_encode( array( 'success' => $gotten, 'fonts' => $fonts ) );

		header( "Content-Type: application/json" );
		echo $response;

		exit;

	}

	function ajax_clear_firsttimer(){

		$firsttimer_update = update_option('typecase_firsttimer','disabled');

		$response = json_encode( array( 'success' => $firsttimer_update ) );

		header( "Content-Type: application/json" );
		echo $response;

		exit;

	}

	function activate() {
	}

	function deactivate() {
	}

	function admin_init() {
		if ( !current_user_can( 'manage_options' ) )
			return;

		load_plugin_textdomain( 'typecase', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}

	function admin_head() {

	}

	function admin_menu() {
		$this->load_menu();
	}

	function load_menu() {

		$hook = add_menu_page( $this->name, $this->name, 'manage_options', 'typecase', array( $this, 'ui' ), plugins_url( 'images/ico_typecase.png', __FILE__ ) );

		add_action( 'admin_print_styles-' . $hook, array($this,'admin_styles'));

	}

	function admin_styles() {

		if ( !current_user_can( 'manage_options' ) )
			return;

		wp_enqueue_script('json2');
		wp_enqueue_script('selectivizr', plugins_url( 'scripts/selectivizr-min.js', __FILE__ ), array('json2'), date( 'Ymd' ) );
		wp_enqueue_script('google-api', 'https://www.google.com/jsapi', array('selectivizr'), date( 'Ymd' ) );
		wp_enqueue_script('typecase', plugins_url( 'scripts/main.js', __FILE__ ), array('jquery','google-api'), date( 'Ymd' ) );
		wp_enqueue_style('typecase', plugins_url( 'styles/main.css', __FILE__ ), false, date( 'Ymd' ) );
		wp_enqueue_style('journal-font', plugins_url( 'fonts/journal/journal.css', __FILE__ ), false, date( 'Ymd' ) );
	}

	function ui(){
	
		$title 							= __('Typecase','typecase');
		$tagline 						= __('Beautiful web fonts for WordPress','typecase');
		$collection 				= __('Your Collection','typecase');
		$nofonts 						= __('You have no fonts in your collection!','typecase');
		$addfonts 					= sprintf( __('Browse the "Available Fonts" below and click %s to add fonts here.','typecase'), '<span class="add"><span></span></span>' );
		$selectors					= __('Selectors','typecase');
		$newselector				= __('New Selector...','typecase');
		$includedvariants 	= __('Included Variants','typecase');
		$availablefonts			= __('Available Fonts','typecase');
		$noresultstitle			= __('No Results!','typecase');
		$searchgoogle				= __('Search Google Webfonts','typecase');
		$noresultsdesc			= __('There are no fonts with that name in the Google Font Library.','typecase');
		$showmorefonts			= __('Load More Fonts','typecase');

		$firsttimer = '';

		if( get_option('typecase_firsttimer') != 'disabled' ):
			echo get_option('typecase_firsttimer');
			$welcome					= __("Welcome! Here’s the rundown on using typecase.","typecase");
			$step_1						= __("Browse or search for fonts in the \"Available Fonts\" box","typecase");
			$step_2						= sprintf(__("Click the %s icon to add the font to \"Your Collection\"","typecase"),'<span class="add"><span></span></span>');
			$step_3						= __("Add CSS selectors and font weights in the right column","typecase");
			$hidehelp_btn			= __("Let's Get Fonted!","typecase");
			$hidehelp_text		= __("(Don't Show This Again)","typecase");

			$firsttimer = '
			<div id="firsttimer">
				<h1>' . $welcome . '</h1>
				<ol>
					<li><span class="list-item"></span><strong>' . $step_1 . '</strong></li>
					<li><span class="list-item"></span><strong>' . $step_2 . '</strong></li>
					<li><span class="list-item"></span><strong>' . $step_1 . '</strong></li>
				</ol>
				<div class="buttons">
					<a class="btn" href="#">' . $hidehelp_btn . '</a>
					<small>' . $hidehelp_text . '</small>
				</div>
			</div>';
		endif;

		echo <<<EOT
		<div id="typecase">
			
			<header id="masthead">
				<h1>
					<strong>$title</strong>
					<span>$tagline</span>
					<a id="upthemes" href="http://upthemes.com">UpThemes</a>
				</h1>
			</header>

			$firsttimer

		  <div id="your-collection">
		    <header>
		      <h1>$collection</h1>
		    </header><!--/header-->
		    <div class="content-wrap">
		      <div class="no-fonts">
		        <h2>$nofonts</h2>
		        <h4>$addfonts</h4>
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
		        <form id="variants-form">
		        </form>
		      </div><!--/.sidebar-->
		      <div class="clear"></div>
		    </div><!--/.content-wrap-->
		  </div><!--/#your-collection-->
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
		          <h2>$noresultstitle</h2>
		          <h4>$noresultsdesc</h4>
		        </div><!--/.no-results-->
		        <div class="font-list" id="loaded-fonts">
		        </div><!--/.font-list#loaded-fonts-->
		        <div class="font-list" id="search-results">
		        </div><!--/.font-list#search-results-->
		      </div><!--/.font-list-wrap-->
		    </div><!--/.content-wrap-->
	      <a id="more-fonts" href=""><span>$showmorefonts</span></a>
		  </div><!--/#available-fonts-->
		</div><!--/#typecase-->
EOT;

	}
	
	function display_frontend(){
		
		$fonts = get_option('typecase_fonts');
		
		if( $fonts[0] ){

			$apiUrl = "http://fonts.googleapis.com/css?family=";
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

}

$typecase = Typecase::init();








