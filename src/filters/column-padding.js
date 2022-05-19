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
	if ( name === 'core/column' ) {
		return assign({}, settings, {
			attributes: merge(settings.attributes, {
				hasPadding: {
					type: 'boolean',
					default: false,
				},
				removeGutter: {
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
	'block-mods/column-block/add-padding-attribute',
	addAttributes,
);

/**
 * Add Size control to Group block
 */
const addInspectorControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const {
			attributes: { hasPadding, removeGutter },
			setAttributes,
			name,
		} = props;
		const toggleHasPadding = () => {
			setAttributes( {
				hasPadding: ! hasPadding,
			} );
		};
		const toggleRemoveGutter = () => {
			setAttributes( {
				removeGutter: ! removeGutter,
			} );
		};
		if ( name !== 'core/column' ) {
			return <BlockEdit {...props} />;
		}
		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title={__('Spacing settings', 'block-mods')}>
						<ToggleControl
							label={__('Add Padding', 'block-mods')}
							checked={ hasPadding }
							onChange={ toggleHasPadding }
						/>
						<ToggleControl
							label={__('Remove Gutter', 'block-mods')}
							checked={ removeGutter }
							onChange={ toggleRemoveGutter }
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withInspectorControl');
addFilter(
	'editor.BlockEdit',
	'block-mods/column-block/add-padding-control',
	addInspectorControl,
);

/**
 * Add padding classes to the block in the editor
 */
const addPaddingClassEditor = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const {
			attributes: { hasPadding, removeGutter },
			className,
			name,
		} = props;
		if ( name !== 'core/column' ) {
			return <BlockListBlock {...props} />;
		}
		return (
			<BlockListBlock
				{...props}
				className={ classnames(className, { 'has-padding' : hasPadding }, { 'no-gutter' : removeGutter } ) }
			/>
		);
	};
}, 'withClientIdClassName');
addFilter(
	'editor.BlockListBlock',
	'block-mods/column-block/add-padding-class-editor',
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
	if ( block.name !== 'core/column' ) {
		return props;
	}
	const { className } = props;
	const { hasPadding, removeGutter } = attributes;
	return assign({}, props, {
		className: classnames(className, { 'has-padding' : hasPadding }, { 'no-gutter' : removeGutter } ),
	});
}
addFilter(
	'blocks.getSaveContent.extraProps',
	'block-mods/column-block/add-padding-class-public',
	addPaddingClassFrontEnd,
);
