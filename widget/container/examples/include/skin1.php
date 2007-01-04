<p>Panels (and all other containers using Standard Module Format) can be skinned using CSS to customize the look and feel of each component. In order to best explain how to customize the Panel's style, it is important to first understand the structure of the basic Panel, which looks like this:</p>

<p><img src="../assets/img/skin-module.gif" width="313" height="86"/></p>

<p>Breaking the Panel down into its basic Standard Module Format, its structure can be diagrammed as such:</p>

<p><img src="../assets/img/skin-chart.gif" width="313" height="86"/></p>

<p>The Panel, like all other YUI Container controls, has a header, body, and footer. In addition, the Panel also has a "close" element containing a background image to give it the appearance of a UI window close control. In this tutorial, we will manipulate the CSS styles for these elements and create several new elements to allow for additional pieces of the skin to be styled.</p>

<p>First, we will create rounded corners for our skin by applying images to the top left and top right corners of the Panel header. All of our CSS styles are applied to this Panel instance using ID selectors. In this case, the Panel's ID will be "myPanel", so all styles will begin with "#myPanel". In order to facilitate the creation of these corners, we will create two new empty <code>div</code> elements in the header, classed as "tl" and "tr" for "top left" and "top right":</p>

<textarea name="code" class="HTML" cols="60" rows="1">
	<div class="hd">
		<div class="tl"></div>
		<span>Panel from Markup</span>
		<div class="tr"></div>
	</div>
</textarea>

<p> Notice that the title is placed into a <code>span</code> tag. This is so that it can be more easily styled using CSS. The images will be applied as background images to each of our new corner elements, along with width and height styles, positioning, and margins:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
#myPanel.panel .hd { 
	padding:0; 
	border:none; 
	background:transparent url(../assets/img/aqua-hd-bg.gif); 
	color:#000; 
	height:22px; 
	margin-left:7px; 
	margin-right:7px; 
	text-align:center; 
	overflow:visible; }

#myPanel.panel .hd span { 
	vertical-align:middle; 
	line-height:22px; }

#myPanel.panel .hd .tl { 
	width:7px; 
	height:22px; 
	top:0; 
	left:0; 
	background:transparent url(../assets/img/aqua-hd-lt.gif); 
	position:absolute; }

#myPanel.panel .hd .tr { 
	width:7px;
	height:22px;
	top:0;
	right:0;
	background:transparent url(../assets/img/aqua-hd-rt.gif);
	position:absolute; }
</textarea>

<p>After absolutely positioning the new corner elements, they are anchored to the left and right corners of the header, as shown in this diagram:</p>

<p><img src="../assets/img/skin-corners.gif" width="313" height="86"/></p>

<p>In this skin, we want our close icon to be positioned on the left side of the header, rather than the right side. We can override the existing "close" style so that the icon will be placed on the left. At the same time, we will apply background images to the close icon for both secure (https) and non-secure (https) servers. Since mixed content from secure and non-secure sites can cause security warnings in some browsers, YUI Container provides CSS hooks for both contexts so that you can specify proper sources for both.</p>

<textarea name="code" class="HTML" cols="60" rows="1">
#myPanel.panel .close { 
	top:3px;
	left:4px;
	height:18px;
	width:17px; }

#myPanel.panel .close.nonsecure { 
	background-image:url(../assets/img/aqua-hd-close.gif); }

#myPanel.panel .close.secure { 
	background-image:url(../assets/img/aqua-hd-close.gif); }

#myPanel.panel .close.nonsecure:hover { 
	background-image:url(../assets/img/aqua-hd-close-over.gif); }

#myPanel.panel .close.secure:hover { 
	background-image:url(../assets/img/aqua-hd-close-over.gif); }
</textarea>

<p>Again, charting the repositioned close icon, it would look like this:</p>

<p><img src="../assets/img/skin-close.gif" width="313" height="86"/></p>

<p>Styling the body and footer are as simple as overriding the default styles with the desired ones:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
#myPanel.panel .bd { 
	overflow:hidden; 
	padding:4px; 
	border:1px solid #aeaeae; 
	background-color:#FFF; }

#myPanel.panel .ft { 
	font-size:75%; 
	color:#666; 
	padding:2px; 
	overflow:hidden; 
	border:1px solid #aeaeae; 
	border-top:none; 
	background-color:#dfdfdf; }
</textarea>

<p>After applying all the styles to our Panel instance, the final output looks like the image below. Looking at the chart, we can see where the original familiar elements end up in the new layout, in addition to our newly created corner elements:</p>

<p><img src="../assets/img/skin-final.gif" width="313" height="86"/><img src="../assets/img/skin-chart2.gif" width="313" height="86"/></p>

<p>We will tackle another skinning example in the <a href="../panelskin/">Advanced Skinning Tutorial</a>.</p>