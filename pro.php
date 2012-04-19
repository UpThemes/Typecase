<?php 

class Typecase_Pro extends Typecase {

	public function Typecase(){
		$this->__construct();
	}

	public function __construct() {

		parent::__construct();

		add_action('wp_ajax_reloadFontPreview',array(&$this,'ajax_reload_font_preview'));
		add_action('init',array(&$this,'set_pro_filters'),1);

		if( isset($_GET['front_end_editor']) && !is_admin() ){
			remove_action('wp_head',array(&$this,'display_frontend'));
			add_action('init',array(&$this,'set_front_end_filters'),1);
			add_action('init',array(&$this,'admin_styles'));
			add_action('wp_head',array(&$this,'front_end_ajaxurl'));
			add_action('init', array(&$this,'front_end_editor_styles'));
			add_action('wp_footer',array(&$this,'ui'));
		}

	}

	public function &init() {
		static $instance = false;

		if ( !$instance ) {
			$instance = new Typecase_Pro();
		}

		return $instance;
	}

	public function set_pro_filters(){
			add_filter('typecase-buttons',array(&$this,'buttons_replace'));
	}

	public function set_front_end_filters(){
		add_filter('typecase-front-end-editor',array(&$this,'front_end_editor_ui'));
		add_filter('typecase-classname',array(&$this,'front_end_classname'));
	}

	public function front_end_ajaxurl() {
		$admin_url = admin_url('admin-ajax.php');
		$nonce = wp_create_nonce($this->nonce_key);
		$output = "
			<script type='text/javascript'>
				var ajaxurl = '$admin_url';
				var frontend = true;
				var typecase_nonce = '$nonce';
			</script>";
		echo $output;
	}

	public function front_end_editor_styles(){

		wp_enqueue_style('front-end-editor', plugins_url( 'styles/front_end_editor.css', __FILE__ ), false, date( 'Ymd' ) );
		wp_enqueue_script('front-end-editor', plugins_url( 'scripts/pro.js', __FILE__ ), false, date( 'Ymd' ) );

	}

	public function ajax_reload_font_preview(){

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

			$font_css = "\n\n<!--====== Typecase Font Declarations ======-->";
			$font_css .= "\n<style type=\"text/css\">\n";
			$font_css .= $import_fonts;
			$font_css .= $font_styles;
			$font_css .= "</style>\n";
			$font_css .= "<!--==-- End Typecase Font Declarations --==-->\n\n";
			
			$response = json_encode( array( 'success' => true, 'css' => $font_css ) );
	
			header( "Content-Type: application/json" );
			echo $response;
			exit;
	
		}

	}

	public function buttons_replace($buttons){
	
		$buttons = '<div class="buttons"><span>Typecase Pro</span> <a class="typecase-btn primary" href="' . get_bloginfo('url') . '/?front_end_editor=1" target="_blank">' . __("Open Live Editor","typecase") . '</a> <a class="typecase-btn" href="http://upthemes.com/forum/" target="_blank">Support Forum</a></div>';
		
		return $buttons;	

	}

	public function front_end_editor_ui($editor_ui){
			$front_end_editor = '<button class="collection typecase-btn" id="your-collection-toggle" data-target="your-collection"><i class="badge">5</i>' . __("View Your Collection","typecase") . '</button> <button class="available typecase-btn" id="available-fonts-toggle" data-target="available-fonts">' . __("Find New Fonts","typecase") . '</button>';
			return $editor_ui.$front_end_editor;
	}
	
	public function front_end_classname($classname){
			$classname = ' class="front_end_editor"';
			
			return $classname;
	}

}

$typecase = Typecase_Pro::init();