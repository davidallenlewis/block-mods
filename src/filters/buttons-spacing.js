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
 * Add padding attributes to Column block
 *
 * @param  {Object} settings Original block settings
 * @param  {stri
 ng} name     Block name
 * @return {Object}          Filtered block settings
 */
function addAttributes(settings, name) {
	if ( name === 'core/buttons' ) {
		return assign({}, settings, {
			attributes: merge(settings.attributes, {
				spaceAbove: {
					type: 'boolean',
					default: false,
				},
				spaceBelow: {
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
	'block-mods/buttons-block/add-spacing-attributes',
	addAttributes,
);

/**
 * Add Size control to Group block
 */
const addInspectorControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const {
			attributes: { spaceAbove, spaceBelow },
			setAttributes,
			name,
		} = props;
		const toggleSpaceAbove = () => {
			setAttributes( {
				spaceAbove: ! spaceAbove,
			} );
		};
		const toggleSpaceBelow = () => {
			setAttributes( {
				spaceBelow: ! spaceBelow,
			} );
		};
		if ( name !== 'core/buttons' ) {
			return <BlockEdit {...props} />;
		}
		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title={__('Spacing settings', 'block-mods')}>
						<ToggleControl
							label={__('Space Above', 'block-mods')}
							checked={ spaceAbove }
							onChange={ toggleSpaceAbove }
						/>
						<ToggleControl
							label={__('Space Below', 'block-mods')}
							checked={ spaceBelow }
							onChange={ toggleSpaceBelow }
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withInspectorControl');
addFilter(
	'editor.BlockEdit',
	'block-mods/buttons-block/add-spacing-controls',
	addInspectorControl,
);

/**
 * Add padding classes to the block in the editor
 */
const addPaddingClassEditor = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const {
			attributes: { spaceAbove, spaceBelow },
			className,
			name,
		} = props;
		if ( name !== 'core/buttons' ) {
			return <BlockListBlock {...props} />;
		}
		return (
			<BlockListBlock
				{...props}
				className={ classnames(className, { 'has-space-above--md' : spaceAbove }, { 'has-space-below--md' : spaceBelow } ) }
			/>
		);
	};
}, 'withClientIdClassName');
addFilter(
	'editor.BlockListBlock',
	'block-mods/buttons-block/add-spacing-class-editor',
	addPaddingClassEditor,
);

/**
 * Add class to the block on the front end
 *
 * @param  {Object} props      Additional props applied to save element.
 * @param  {Object} block      Block type.
 * @param  {Object} attributes Current block attributes.
 * @return {Object}            Filtered props applied to save element.
 */
function addPaddingClassFrontEnd(props, block, attributes) {
	if ( block.name !== 'core/buttons' ) {
		return props;
	}
	const { className } = props;
	const { spaceAbove, spaceBelow } = attributes;
	return assign({}, props, {
		className: classnames(className, { 'has-space-above--md' : spaceAbove }, { 'has-space-below--md' : spaceBelow } ),
	});
}
addFilter(
	'blocks.getSaveContent.extraProps',
	'block-mods/buttons-block/add-spacing-class-public',
	addPaddingClassFrontEnd,
);
