<?php

class Typecase_Pro extends Typecase {

	/**
	 * Constructor for the Typecase class
	 *
	 * Sets up all the appropriate hooks and actions
	 * within our plugin.
	 *
	 * @uses parent::__construct()
	 * @uses is_admin()
	 * @uses add_action()
	 *
	 */
 	public function __construct() {

		parent::__construct();

		add_action('wp_ajax_reloadFontPreview',array(&$this,'ajax_reload_font_preview'));
		add_action('init',array(&$this,'set_pro_filters'),1);

		if( isset($_GET['front_end_editor']) && !is_admin() ){
			remove_action('wp_head',array(&$this,'display_frontend'));
			add_action('init',array(&$this,'set_front_end_filters'),1);
			add_action('init',array(&$this,'admin_styles'));
			add_action('wp_head',array(&$this,'frontend_js_globals'));
			add_action('wp_enqueue_scripts', array(&$this,'frontend_scripts'));
			add_action('wp_footer',array(&$this,'ui'));
		}

	}

	public function Typecase(){
		$this->__construct();
	}

	/**
	 * Initializes the Typecase_Pro() class
	 *
	 * Checks for an existing Typecase_Pro() instance
	 * and if it doesn't find one, creates it.
	 *
	 * @uses Typecase_Pro()
	 *
	 */
	public static function &init() {
		static $instance = false;

		if ( !$instance ) {
			$instance = new Typecase_Pro();
		}

		return $instance;
	}

	/**
	 * Set up Typecase Pro admin filters
	 *
	 * Sets up all the appropriate filters for Pro version
	 * within the admin section of plugin.
	 *
	 * @uses add_filter()
	 *
	 */
	public function set_pro_filters(){
			add_filter('typecase-buttons',array(&$this,'buttons_replace'));
	}

	/**
	 * Set up Typecase Pro front-end filters
	 *
	 * Sets up all the appropriate filters for Pro version
	 * within front-end of plugin.
	 *
	 * @uses add_filter()
	 *
	 */
	public function set_front_end_filters(){
		add_filter('typecase-front-end-editor',array(&$this,'front_end_editor_ui'));
		add_filter('typecase-classname',array(&$this,'front_end_classname'));
	}

	/**
	 * Set up global variables for our Javascript on the frontend.
	 *
	 * @uses admin_url()
	 *
	 */
	public function frontend_js_globals() {
		$admin_url = admin_url('admin-ajax.php');
		$output = "
			<script type='text/javascript'>
				var ajaxurl = '$admin_url';
				var frontend = true;
			</script>";
		echo $output;
	}

	/**
	 * Enqueues scripts/styles for front-end editor
	 *
	 * @uses wp_enqueue_style()
	 * @uses wp_enqueue_script()
	 * @uses plugins_url()
	 *
	 */
	public function frontend_scripts(){
		wp_enqueue_style('front-end-editor', plugins_url( 'styles/front_end_editor.css', TYPECASE_FILE ), false, date( 'Ymd' ) );
		wp_enqueue_script('front-end-editor', plugins_url( 'scripts/pro.js', TYPECASE_FILE ), false, date( 'Ymd' ) );
	}

	/**
	 * Live font preview updater.
	 *
	 * Regenerates the CSS for our fonts every time something gets saved.
	 *
	 * @uses get_option()
	 * @uses explode()
	 * @uses substr()
	 * @uses strpos()
	 * @uses mb_substr()
	 * @uses str_replace()
	 * @uses json_encode()
	 * @uses header()
	 *
	 */
	public function ajax_reload_font_preview(){
		$fonts = get_option('typecase_fonts');

		if( $fonts[0] ){

			$apiUrl = &$this->api_url;
			$import_url = '';
			$font_styles = '';

			foreach($fonts as $font){

				$family = explode("|",$font[0]);
				$family = $family[0];
				$selectors = substr( $font[1], 1);
				$weights = substr( $font[2], 1);

				$import_url .= str_replace(" ","+",$family).$this->stringify_font_part($weights).$this->stringify_font_part($charsets);

				$selectors = explode("|",$selectors);

				foreach( $selectors as $i => $selector){
					if($i>0)
						$font_styles .= ",";
					$font_styles .= $selector;
				}

				$font_styles .= "{ font-family: \"$family\"; }\n";

			}

			$import_fonts = "@import url($apiUrl$import_url);\n";

			$font_css = "\n\n<!--====== Typecase Font Declarations ======-->";
			$font_css .= "\n<style type=\"text/css\">\n";
			$font_css .= $import_fonts;
			$font_css .= $font_styles;
			$font_css .= "</style>\n";
			$font_css .= "<!--==-- End Typecase Font Declarations --==-->\n\n";

			$new_nonce = array( 'nonce' => wp_create_nonce($this->nonce_key) );

			$response = json_encode( array( '_new_nonce' => $new_nonce, 'success' => true, 'css' => $font_css ) );

			header( "Content-Type: application/json" );
			echo $response;
			exit;

		} else {

			$response = json_encode( array( 'success' => false, 'error' => __('There were no fonts defined','typecase') ) );

			header( "Content-Type: application/json" );
			echo $response;
			exit;

		}

	}

	/**
	 * Modifies admin header buttons and returns Typecase Pro buttons
	 *
	 * @return $buttons	New set of buttons
	 *
	 */
	public function buttons_replace($buttons){

		$buttons = '<div class="buttons"><span class="pro-badge"></span> <a class="typecase-btn primary" href="' . get_bloginfo('url') . '/?front_end_editor=1" target="_blank">' . __("Open Live Editor","typecase") . '</a> <a class="typecase-btn" href="http://upthemes.com/" target="_blank">WordPress Themes by UpThemes</a></div>';

		return $buttons;

	}

	/**
	 * Modifies front-end editor UI and returns new buttons
	 *
	 * @return $editor_ui Modified editor UI
	 *
	 */
	public function front_end_editor_ui($editor_ui){
			$front_end_editor = '<iframe></iframe><button class="collection typecase-btn" id="your-collection-toggle" data-target="your-collection"><i class="badge"></i>' . __("View Your Collection","typecase") . '</button> <button class="available typecase-btn" id="available-fonts-toggle" data-target="available-fonts">' . __("Find New Fonts","typecase") . '</button>';
			$editor_ui = $editor_ui.$front_end_editor;
			return $editor_ui;
	}

	/**
	 * Returns front-end editor classname
	 *
	 * @return $classname Modified classname for front-end #typecase container
	 *
	 */
	public function front_end_classname($classname){
			$classname = ' class="front_end_editor"';

			return $classname;
	}

}

$typecase = Typecase_Pro::init();