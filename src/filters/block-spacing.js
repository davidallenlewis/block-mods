import classnames from 'classnames';
import { ToggleControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

const { assign, merge } = lodash;
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, SelectControl } = wp.components;

/**
 * Add spacing attributes to Group block
 *
 * @param  {Object} settings Original block settings
 * @param  {string} name     Block name
 * @return {Object}          Filtered block settings
 */
function addAttributes(settings, name) {
	if ( name === 'core/group' || name === 'core/cover' || name === 'core/columns' || name === 'core/media-text' ) {
		return assign({}, settings, {
			attributes: merge(settings.attributes, {
				hasInnerSpacing: {
					type: 'boolean',
					default: true,
				},
				hasOuterSpacing: {
					type: 'boolean',
					default: false,
				},
				hasRainbowSeparator: {
					type: 'boolean',
					default: false,
				},
			}),
		});
	}
	return settings;
}
addFilter(
	'blocks.registerBlockType',
	'block-mods/multiple-blocks/add-spacing-attributes',
	addAttributes,
);

/**
 * Add Size control to Group block
 */
const addInspectorControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const {
			attributes: { hasInnerSpacing, hasOuterSpacing, hasRainbowSeparator },
			setAttributes,
			name,
		} = props;
		const toggleHasInnerSpacing = () => {
			setAttributes( {
				hasInnerSpacing: ! hasInnerSpacing,
			} );
		};
		const toggleHasOuterSpacing = () => {
			setAttributes( {
				hasOuterSpacing: ! hasOuterSpacing,
			} );
		};
		const toggleHasRainbowSeparator = () => {
			setAttributes( {
				hasRainbowSeparator: ! hasRainbowSeparator,
			} );
		};
		if ( name !== 'core/group' && name !== 'core/cover' && name !== 'core/columns' && name !== 'core/media-text' ) {
			return <BlockEdit {...props} />;
		}
		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title={__('Spacing & Separators', 'block-mods')} initialOpen={true}>
						<ToggleControl
							label={__('Inner Spacing', 'block-mods')}
							checked={ hasInnerSpacing }
							onChange={ toggleHasInnerSpacing }
						/>
						<ToggleControl
							label={__('Outer Spacing', 'block-mods')}
							checked={ hasOuterSpacing }
							onChange={ toggleHasOuterSpacing }
						/>
						<ToggleControl
							label={__('Rainbow Separator', 'block-mods')}
							checked={ hasRainbowSeparator }
							onChange={ toggleHasRainbowSeparator }
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withInspectorControl');
addFilter(
	'editor.BlockEdit',
	'block-mods/multiple-blocks/add-spacing-controls',
	addInspectorControl,
);

/**
 * Add spacing classes to the block in the editor
 */
const addSizeClassEditor = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const {
			attributes: { hasOuterSpacing, hasInnerSpacing, hasRainbowSeparator },
			className,
			name,
		} = props;
		if ( name !== 'core/group' && name !== 'core/cover' && name !== 'core/columns' && name !== 'core/media-text' ) {
			return <BlockListBlock {...props} />;
		}
		return (
			<BlockListBlock
				{...props}
				className={ classnames(className, { 'has-inner-spacing' : hasInnerSpacing }, { 'has-outer-spacing' : hasOuterSpacing }, { 'has-rainbow-separator' : hasRainbowSeparator } ) }
			/>
		);
	};
}, 'withClientIdClassName');
addFilter(
	'editor.BlockListBlock',
	'block-mods/multiple-blocks/add-spacing-classes-editor',
	addSizeClassEditor,
);

/**
 * Add class to the block on the front end
 *
 * @param  {Object} props      Additional props applied to save element.
 * @param  {Object} block      Block type.
 * @param  {Object} attributes Current block attributes.
 * @return {Object}            Filtered props applied to save element.
 */
function addSizeClassFrontEnd(props, block, attributes) {
	if ( block.name !== 'core/group' && block.name !== 'core/cover' && block.name !== 'core/columns' && block.name !== 'core/media-text' ) {
		return props;
	}
	const { className } = props;
	const { hasOuterSpacing, hasInnerSpacing, hasRainbowSeparator } = attributes;
	return assign({}, props, {
		className: classnames(className, { 'has-inner-spacing' : hasInnerSpacing }, { 'has-outer-spacing' : hasOuterSpacing }, { 'has-rainbow-separator' : hasRainbowSeparator } ),
	});
}

// Comment out to test the PHP approach defined in block-mods.php
addFilter(
	'blocks.getSaveContent.extraProps',
	'block-mods/multiple-blocks/add-spacing-classes-public',
	addSizeClassFrontEnd,
);
