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
 * Add custom attribute to Heading block
 *
 * @param  {Object} settings Original block settings
 * @param  {string} name     Block name
 * @return {Object}          Filtered block settings
 */
function addAttributes(settings, name) {
	if ( name === 'core/heading' || name === 'core/post-title' ) {
		return assign({}, settings, {
			attributes: merge(settings.attributes, {
				hasRule: {
					type: 'boolean',
					default: true,
				},
				hasTopMargin: {
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
	'block-mods/heading-block/add-custom-attributes',
	addAttributes,
);

/**
 * Add Size control to Heading block
 */
const addInspectorControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const {
			attributes: { hasRule, hasTopMargin },
			setAttributes,
			name,
		} = props;
		const toggleHasRule = () => {
			setAttributes( {
				hasRule: ! hasRule,
			} );
		};
		const toggleHasTopMargin = () => {
			setAttributes( {
				hasTopMargin: ! hasTopMargin,
			} );
		};
		if ( name !== 'core/heading' && name !== 'core/post-title' ) {
			return <BlockEdit {...props} />;
		}
		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title={__('Style settings', 'block-mods')} initialOpen={true}>
						<ToggleControl
							label={__('Green Underline', 'block-mods')}
							checked={ hasRule }
							onChange={ toggleHasRule }
						/>
						<ToggleControl
							label={__('Top Margin', 'block-mods')}
							checked={ hasTopMargin }
							onChange={ toggleHasTopMargin }
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withInspectorControl');
addFilter(
	'editor.BlockEdit',
	'block-mods/heading-block/add-custom-controls',
	addInspectorControl,
);

/**
 * Add has-rule class to the block in the editor
 */
const addSizeClassEditor = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const {
			attributes: { hasRule, hasTopMargin },
			className,
			name,
		} = props;

		if ( name !== 'core/heading' && name !== 'core/post-title' ) {
			return <BlockListBlock {...props} />;
		}

		return (
			<BlockListBlock
				{...props}
				className={ classnames( className, {'has-green-underline' : hasRule}, {'has-top-margin' : hasTopMargin} ) }
			/>
		);
	};
}, 'withClientIdClassName');
addFilter(
	'editor.BlockListBlock',
	'block-mods/heading-block/add-custom-classes-editor',
	addSizeClassEditor,
);

/**
 * Add class to the block on the front end
 *
 * @param  {Object} props      Additional props applied to save element.
 * @param  {Object} block      Block type.
 * @param  {Object} attributes Current block attributes.
 * @note   core/post-title has no save function so use render_block PHP filter instead in index.php
 * @return {Object}            Filtered props applied to save element
 */
function addSizeClassFrontEnd(props, block, attributes) {
	if ( block.name !== 'core/heading' ) {
		return props;
	}
	const { className } = props;
	const { hasRule, hasTopMargin } = attributes;
	return assign({}, props, {
		className: classnames(className, {'has-green-underline' : hasRule}, {'has-top-margin' : hasTopMargin} ),
	});
}

// Comment out to test the PHP approach defined in block-mods.php
addFilter(
	'blocks.getSaveContent.extraProps',
	'block-mods/heading-block/add-custom-classes-public',
	addSizeClassFrontEnd,
);
