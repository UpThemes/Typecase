=== Typecase Web Fonts ===

Contributors: chriswallace,garand,upthemes
Donate link: http://upthemes.com/
Tags: web fonts, typography, font manager, type, Google Web Fonts
Requires at least: 3.1
Tested up to: 4.1
Stable tag: 1.0
License: GPLv2

Typecase is a web font management plugin that allows you to browse, search, and embed over 500 fonts from Google Web Fonts.

== Description ==

Typecase makes working with web fonts in WordPress a glorious experience. With over 500 fonts from Google Web Fonts, Typecase is a unique and easy-to-use typography plugin that allows you to quickly browse, find, and select fonts to apply to your website.

Developed by [UpThemes](http://upthemes.com).

One thing to be aware of is that you must have a working knowledge of CSS and CSS selectors to be able to apply fonts to your WordPress site. If you do not know anything about CSS or have the ability to use dev tools to identify HTML elements, we recommend using a theme with custom fonts already enabled.

== Installation ==

1. [Download Typecase](http://downloads.wordpress.org/plugin/typecase.zip)
2. Install the Typecase plugin by going to Plugins > Add New > Upload and select the typecase.zip file and click the "upload" button.
3. Activate the plugin.
4. Locate the Typecase menu item on the left side menu.
5. Follow the on-screen instructions to begin using Typecase.

== Frequently Asked Questions ==

= What If I Don't Understand CSS selectors? =

I would encourage you to learn some CSS. If you don't want to learn CSS, I would encourage you to install [Firebug](http://getfirebug.com/) (for Firefox) or enable the webkit developer tools for [Safari](http://inspectelement.com/didyouknow/enable-safaris-awesome-built-in-development-tools/) or [Chrome](https://developer.chrome.com/devtools).

Once you install one of these plugins, use the inspector tool to be able to hover over and click on different page elements like h1 (a top-level heading element) or p (a paragraph element).

Once you find the element you want to target, you will add a new "selector" for the font you've added to "Your Collection." In the "Selectors" sidebar, simple enter the element like so: "h1" or "body" or "article" (this is a new HTML5 element).

To target certain parts of the page that may use an ID or class name, you would enter "#id" or ".classname" to target those sections of the page.

= What If I'm Targeting Something That is Already Being Targeted? =

Well, this is a problem. Your theme is probably applying the "font-family" CSS property in a non-graceful way. My recommendation is to "cascade" your styles by using extremely specific selectors so that you override your theme's naughty CSS by selecting "html body #id" or something to that effect.

= Are all fonts available from Google Web Fonts? =

The plugin fetches the latest list of fonts from Google every time you edit your fonts, making it easy to grab the latest and greatest web fonts Google has to offer.

== Screenshots ==

1. Edit your website's web fonts easily with Typecase.
2. Instantly search Google Web Fonts' selection of over 500 web fonts, all optimized for the web.
3. Take a peek at your beautiful fonts on the front-end of your website. Ahhh, so pretty.

== Changelog ==

= 0.3.4 =
* Fixed bug where fonts would eventually be hidden in Firefox on Windows.
* Fixed issue where some fonts display "Undefined" for character sets.
* Fixed deleting fonts does not re-enable the add button in the library.
* Fixed deleting a selector triggers confirm dialog.

= 0.3.1 =
* Initial release.
