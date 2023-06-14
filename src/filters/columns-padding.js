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
	if ( name === 'core/columns' ) {
		return assign({}, settings, {
			attributes: merge(settings.attributes, {
				flushLeft: {
					type: 'boolean',
					default: false,
				},
				flushRight: {
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
	'block-mods/column-blocks/add-padding-attribute',
	addAttributes,
);

/**
 * Add Size control to Group block
 */
const addInspectorControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const {
			attributes: { flushLeft, flushRight },
			setAttributes,
			name,
		} = props;
		const toggleFlushLeft = () => {
			setAttributes( {
				flushLeft: ! flushLeft,
			} );
		};
		const toggleFlushRight = () => {
			setAttributes( {
				flushRight: ! flushRight,
			} );
		};
		if ( name !== 'core/columns' ) {
			return <BlockEdit {...props} />;
		}
		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title={__('Spacing settings', 'block-mods')}>
						<ToggleControl
							label={__('Flush Left', 'block-mods')}
							checked={ flushLeft }
							onChange={ toggleFlushLeft }
						/>
						<ToggleControl
							label={__('Flush Right', 'block-mods')}
							checked={ flushRight }
							onChange={ toggleFlushRight }
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withInspectorControl');
addFilter(
	'editor.BlockEdit',
	'block-mods/column-blocks/add-padding-control',
	addInspectorControl,
);

/**
 * Add padding classes to the block in the editor
 */
const addPaddingClassEditor = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const {
			attributes: { flushLeft, flushRight },
			className,
			name,
		} = props;
		if ( name !== 'core/columns' ) {
			return <BlockListBlock {...props} />;
		}
		return (
			<BlockListBlock
				{...props}
				className={ classnames(className, { 'is-flush-left' : flushLeft }, { 'is-flush-right' : flushRight } ) }
			/>
		);
	};
}, 'withClientIdClassName');
addFilter(
	'editor.BlockListBlock',
	'block-mods/column-blocks/add-padding-class-editor',
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
	const { className } = props;
	const { flushLeft, flushRight } = attributes;
	if ( block.name === 'core/columns' ) {
		return assign({}, props, {
			className: classnames(className, { 'is-flush-left' : flushLeft }, { 'is-flush-right' : flushRight } ),
		});
	} else {
		return props;
	}
}
addFilter(
	'blocks.getSaveContent.extraProps',
	'block-mods/column-blocks/add-padding-class-public',
	addPaddingClassFrontEnd,
);
