<?php 

class Typecase_Pro extends Typecase {

	function Typecase(){
		$this->__construct();
	}

	function __construct() {

		parent::__construct();

		add_action('wp_ajax_reloadFontPreview',array($this,'ajax_reload_font_preview'));
		add_action('init',array($this,'set_pro_filters'),1);

		if( isset($_GET['front_end_editor']) ){
			remove_action('wp_head',array($this,'display_frontend'));
			add_action('init',array($this,'set_front_end_filters'),1);
			add_action('init',array($this,'admin_styles'));
			add_action('wp_head',array($this,'front_end_ajaxurl'));
			add_action('init', array($this,'front_end_editor_styles'));
			add_action('wp_footer',array($this,'ui'));
		}

	}

	function &init() {
		static $instance = false;

		if ( !$instance ) {
			$instance = new Typecase_Pro();
		}

		return $instance;
	}

	function set_pro_filters(){
			add_filter('typecase-buttons',array($this,'buttons_replace'));
	}

	function set_front_end_filters(){
		add_filter('typecase-front-end-editor',array($this,'front_end_editor_ui'));
		add_filter('typecase-classname',array($this,'front_end_classname'));
	}

	function front_end_ajaxurl() { ?>
		<script type="text/javascript">
		var ajaxurl = '<?php echo admin_url('admin-ajax.php'); ?>';
		var frontend = true;
		</script>
		<?php
	}

	function front_end_editor_styles(){

		wp_enqueue_style('front-end-editor', plugins_url( 'styles/front_end_editor.css', __FILE__ ), false, date( 'Ymd' ) );
		wp_enqueue_script('front-end-editor', plugins_url( 'scripts/pro.js', __FILE__ ), false, date( 'Ymd' ) );

	}

	function ajax_reload_font_preview(){

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

	function buttons_replace($buttons){
	
		$buttons = '<div class="buttons"><span>Typecase Pro</span> <a class="typecase-btn primary" href="' . get_bloginfo('url') . '/?front_end_editor=1" target="_blank">' . __("Open Live Editor","typecase") . '</a> <a class="typecase-btn" href="http://upthemes.com/forum/" target="_blank">Support Forum</a></div>';
		
		return $buttons;	

	}

	function front_end_editor_ui($editor_ui){
			$front_end_editor = '<a class="collection typecase-btn" id="your-collection-toggle" data-target="your-collection" href="">' . __("View Your Collection","typecase") . '</a> <a class="available typecase-btn" id="available-fonts-toggle" data-target="available-fonts" href="">' . __("Find New Fonts","typecase") . '</a>';
			return $editor_ui.$front_end_editor;
	}
	
	function front_end_classname($classname){
			$classname = ' class="front_end_editor"';
			
			return $classname;
	}

}

$typecase = Typecase_Pro::init();