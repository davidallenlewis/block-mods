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
 * Add Ruled attribute to Heading block
 *
 * @param  {Object} settings Original block settings
 * @param  {string} name     Block name
 * @return {Object}          Filtered block settings
 */
function addAttributes(settings, name) {
	if (name === 'core/heading') {
		return assign({}, settings, {
			attributes: merge(settings.attributes, {
				hasRule: {
					type: 'boolean',
					default: true,
				},
			}),
		});
	}
	return settings;
}
addFilter(
	'blocks.registerBlockType',
	'block-mods/heading-block/add-attributes',
	addAttributes,
);

/**
 * Add Size control to Heading block
 */
const addInspectorControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const {
			attributes: { hasRule },
			setAttributes,
			name,
		} = props;
		const togglehasRule = () => {
			setAttributes( {
				hasRule: ! hasRule,
			} );
		};
		if (name !== 'core/heading') {
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
							onChange={ togglehasRule }
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withInspectorControl');
addFilter(
	'editor.BlockEdit',
	'block-mods/heading-block/add-inspector-controls',
	addInspectorControl,
);

/**
 * Add has-rule class to the block in the editor
 */
const addSizeClassEditor = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const {
			attributes: { hasRule },
			className,
			name,
		} = props;

		if (name !== 'core/heading') {
			return <BlockListBlock {...props} />;
		}

		return (
			<BlockListBlock
				{...props}
				className={classnames(className, {'has-rule' : hasRule})}
			/>
		);
	};
}, 'withClientIdClassName');
addFilter(
	'editor.BlockListBlock',
	'block-mods/heading-block/add-ruled-class',
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
	if ( block.name !== 'core/heading' ) {
		return props;
	}
	const { className } = props;
	const { hasRule } = attributes;
	return assign({}, props, {
		className: classnames(className, {'has-rule' : hasRule} ),
	});
}

// Comment out to test the PHP approach defined in block-mods.php
addFilter(
	'blocks.getSaveContent.extraProps',
	'block-mods/heading-block/add-front-end-class',
	addSizeClassFrontEnd,
);
