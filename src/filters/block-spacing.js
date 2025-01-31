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
				hasRainbowSeparatorTop: {
					type: 'boolean',
					default: false,
				},
				hasRainbowSeparatorBottom: {
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
			attributes: { hasInnerSpacing, hasOuterSpacing, hasRainbowSeparatorTop, hasRainbowSeparatorBottom },
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
		const toggleHasRainbowSeparatorTop = () => {
			setAttributes( {
				hasRainbowSeparatorTop: ! hasRainbowSeparatorTop,
			} );
		};
		const toggleHasRainbowSeparatorBottom = () => {
			setAttributes( {
				hasRainbowSeparatorBottom: ! hasRainbowSeparatorBottom,
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
							label={__('Rainbow Bar (Top)', 'block-mods')}
							checked={ hasRainbowSeparatorTop }
							onChange={ toggleHasRainbowSeparatorTop }
						/>
						<ToggleControl
							label={__('Rainbow Bar (Bottom)', 'block-mods')}
							checked={ hasRainbowSeparatorBottom }
							onChange={ toggleHasRainbowSeparatorBottom }
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
			attributes: { hasOuterSpacing, hasInnerSpacing, hasRainbowSeparatorTop, hasRainbowSeparatorBottom },
			className,
			name,
		} = props;
		if ( name !== 'core/group' && name !== 'core/cover' && name !== 'core/columns' && name !== 'core/media-text' ) {
			return <BlockListBlock {...props} />;
		}
		return (
			<BlockListBlock
				{...props}
				className={ classnames(
					className,
					{ 'has-inner-spacing' : hasInnerSpacing },
					{ 'has-outer-spacing' : hasOuterSpacing },
					{ 'has-rainbow-separator has-rainbow-separator--top' : hasRainbowSeparatorTop },
					{ 'has-rainbow-separator has-rainbow-separator--bottom' : hasRainbowSeparatorBottom }
				) }
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
	const { className } = props;
	const { hasOuterSpacing, hasInnerSpacing, hasRainbowSeparatorTop, hasRainbowSeparatorBottom } = attributes;
	if ( block.name === 'core/group' || block.name === 'core/cover' || block.name === 'core/columns' || block.name === 'core/media-text' ) {
		return assign({}, props, {
			className: classnames(
				className,
				{ 'has-inner-spacing' : hasInnerSpacing },
				{ 'has-outer-spacing' : hasOuterSpacing },
				{ 'has-rainbow-separator has-rainbow-separator--top' : hasRainbowSeparatorTop },
				{ 'has-rainbow-separator has-rainbow-separator--bottom' : hasRainbowSeparatorBottom }
			),
		});
	} else {
		return props;
	}
}
addFilter(
	'blocks.getSaveContent.extraProps',
	'block-mods/multiple-blocks/add-spacing-classes-public',
	addSizeClassFrontEnd,
);
