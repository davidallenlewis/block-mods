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
	if (name === 'core/group') {
		return assign({}, settings, {
			attributes: merge(settings.attributes, {
				hasOuterSpacing: {
					type: 'boolean',
					default: false,
				},
				hasInnerSpacing: {
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
	'block-mods/group-block/add-attributes',
	addAttributes,
);

/**
 * Add Size control to Group block
 */
const addInspectorControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const {
			attributes: { hasOuterSpacing, hasInnerSpacing },
			setAttributes,
			name,
		} = props;
		const toggleHasOuterSpacing = () => {
			setAttributes( {
				hasOuterSpacing: ! hasOuterSpacing,
			} );
		};
		const toggleHasInnerSpacing = () => {
			setAttributes( {
				hasInnerSpacing: ! hasInnerSpacing,
			} );
		};
		if (name !== 'core/group') {
			return <BlockEdit {...props} />;
		}
		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title={__('Spacing', 'block-mods')} initialOpen={true}>
						<ToggleControl
							label={__('Outer Spacing', 'block-mods')}
							checked={ hasOuterSpacing }
							onChange={ toggleHasOuterSpacing }
						/>
						<ToggleControl
							label={__('Inner Spacing', 'block-mods')}
							checked={ hasInnerSpacing }
							onChange={ toggleHasInnerSpacing }
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withInspectorControl');
addFilter(
	'editor.BlockEdit',
	'block-mods/group-block/add-inspector-controls',
	addInspectorControl,
);

/**
 * Add spacing classes to the block in the editor
 */
const addSizeClassEditor = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const {
			attributes: { hasOuterSpacing, hasInnerSpacing },
			className,
			name,
		} = props;

		if (name !== 'core/group') {
			return <BlockListBlock {...props} />;
		}

		return (
			<BlockListBlock
				{...props}
				className={ classnames(className, { 'has-outer-spacing' : hasOuterSpacing }, { 'has-inner-spacing' : hasInnerSpacing } ) }
			/>
		);
	};
}, 'withClientIdClassName');
addFilter(
	'editor.BlockListBlock',
	'block-mods/group-block/add-spacing-classes',
	addSizeClassEditor,
);

/**
 * Add size class to the block on the front end
 *
 * @param  {Object} props      Additional props applied to save element.
 * @param  {Object} block      Block type.
 * @param  {Object} attributes Current block attributes.
 * @return {Object}            Filtered props applied to save element.
 */
function addSizeClassFrontEnd(props, block, attributes) {
	if (block.name !== 'core/group') {
		return props;
	}
	const { className } = props;
	const { hasOuterSpacing, hasInnerSpacing } = attributes;
	return assign({}, props, {
		className: classnames(className, { 'has-outer-spacing' : attributes.hasOuterSpacing }, { 'has-inner-spacing' : attributes.hasInnerSpacing } ),
	});
}

// Comment out to test the PHP approach defined in block-mods.php
addFilter(
	'blocks.getSaveContent.extraProps',
	'block-mods/group-block/add-front-end-class',
	addSizeClassFrontEnd,
);
