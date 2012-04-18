# Typecase

Typecase is a web font management plugin for WordPress providing access to over 500 fonts from Google Web Fonts.

## Using Typecase

1. (Download Typecase)[http://typecasewp.com]
2. Install the Typecase plugin by going to Plugins > Add New > Upload and select the typecase.zip file and click the "upload" button.
3. Activate the plugin.
4. Locate the Typecase menu item on the left side menu.
5. Following the on-screen instructions to begin using Typecase.

## What If I Don't Understand CSS selectors?

I would encourage you to learn some CSS. If you don't want to learn CSS, I would encourage you to install [Firebug](http://getfirebug.com/) (for Firefox) or enable the webkit developer tools for [Safari](http://inspectelement.com/didyouknow/enable-safaris-awesome-built-in-development-tools/) or Chrome.

Once you install one of these plugins, use the inspector tool to be able to hover over and click on different page elements like h1 (a top-level heading element) or p (a paragraph element).

Once you find the element you want to target, you will add a new "Selector" for the font you've added to "Your Collection." In the "Selectors" sidebar, simple enter the element like so: "h1" or "body" or "article" (this is a new HTML5 element).

To target certain parts of the page that may use an ID or class name, you would enter "#id" or ".classname" to target those sections of the page.

## What If I'm Targeting Something That is Already Being Targeted?

Well, this is a problem. Your theme probably sucks and is applying the "font-family" CSS declaration to something in a non-graceful way. My recommendation is to "cascade" your styles by using extremely specific selectors so that you override your theme's naughty CSS by selecting "html body #id" or something to that effect.