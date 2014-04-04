<?php

require_once get_template_directory() . '/inc/init.php';
require_once get_template_directory() . '/inc/assets.php';
require_once get_template_directory() . '/inc/content-functions.php';

$google_analytics_id = 'UA-XXXXXXXX-X';

// Add socket.io snippet to enable Browser Sync
function add_browser_sync() {
  echo "<script src='http://localhost:3000/socket.io/socket.io.js'></script><script src='http://localhost:3001/browser-sync-client.min.js'></script>";
}
if ($environment['name'] == 'local') {
  add_action('wp_footer','add_browser_sync');
}

// Navigation Menu Array
register_nav_menus( array(
  'main' => 'Main Navigation'
) );