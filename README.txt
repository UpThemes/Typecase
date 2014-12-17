=== Typecase Web Fonts ===
Contributors: chriswallace,garand
Donate link: http://upthemes.com/
Tags: web fonts, typography, font manager
Requires at least: 3.1
Tested up to: 4.1
Stable tag: 0.3.4
License: GPLv2

Typecase is a web font management plugin that allows you to browse, search, and embed over 500 fonts from Google Web Fonts.

== Description ==

Typecase makes working with web fonts on WordPress a glorious experience. With over 500 fonts from Google Web Fonts, Typecase is a unique and easy-to-use typography plugin that allows you to quickly browse, find, and select fonts to apply to your website.

Developed by [UpThemes](http://upthemes.com). 

== Installation ==

1. [Download Typecase](http://downloads.wordpress.org/plugin/typecase.zip)
2. Install the Typecase plugin by going to Plugins > Add New > Upload and select the typecase.zip file and click the "upload" button.
3. Activate the plugin.
4. Locate the Typecase menu item on the left side menu.
5. Following the on-screen instructions to begin using Typecase.

== Frequently Asked Questions ==

= What If I Don't Understand CSS selectors? =

I would encourage you to learn some CSS. If you don't want to learn CSS, I would encourage you to install [Firebug](http://getfirebug.com/) (for Firefox) or enable the webkit developer tools for [Safari](http://inspectelement.com/didyouknow/enable-safaris-awesome-built-in-development-tools/) or Chrome.

Once you install one of these plugins, use the inspector tool to be able to hover over and click on different page elements like h1 (a top-level heading element) or p (a paragraph element).

Once you find the element you want to target, you will add a new "Selector" for the font you've added to "Your Collection." In the "Selectors" sidebar, simple enter the element like so: "h1" or "body" or "article" (this is a new HTML5 element).

To target certain parts of the page that may use an ID or class name, you would enter "#id" or ".classname" to target those sections of the page.

= What If I'm Targeting Something That is Already Being Targeted? =

Well, this is a problem. Your theme probably sucks and is applying the "font-family" CSS declaration to something in a non-graceful way. My recommendation is to "cascade" your styles by using extremely specific selectors so that you override your theme's naughty CSS by selecting "html body #id" or something to that effect.

= Are all fonts available from Google Web Fonts? =

The plugin fetches the latest list of fonts from Google every time you edit your fonts, making it easy to grab the latest and greatest web fonts Google has to offer.

= Will you offer support for Typekit, Fontdeck, Fonts.com and other web font services? =

We're currently looking into it and would love to be able to provide a much larger font selection as soon as possible. As for right now, we have not begun building that piece out yet.

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
