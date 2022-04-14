<?php
/**
 * Plugin Name: Block Modifications
 * Description: A plugin that modifies and extends native Gutenberg Block functionality
 * Author:      Media Mechanics
 * Author URI:  https://mediamechanics.com
 * Version:     0.1.0
 *
 * @package     BlockMods
 */

namespace BlockMods;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
};

function editor_assets() {
	wp_enqueue_script(
		'block-mods-editor-script',
		plugin_dir_url( __FILE__ ) . 'build/index.js',
		[ 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ],
		'0.1.0'
	);
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\editor_assets' );