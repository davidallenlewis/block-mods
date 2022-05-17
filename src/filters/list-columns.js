import classnames from 'classnames';
import { Button, ButtonGroup } from '@wordpress/components';

const { assign, merge } = lodash;
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, SelectControl } = wp.components;

/**
 * Add columns attribute to Button block
 *
 * @param  {Object} settings Original block settings
 * @param  {string} name     Block name
 * @return {Object}          Filtered block settings
 */
function addAttributes(settings, name) {
	if (name === 'core/list') {
		return assign({}, settings, {
			attributes: merge(settings.attributes, {
				columns: {
					type: 'string',
					default: '1',
				},
			}),
		});
	}
	return settings;
}
addFilter(
	'blocks.registerBlockType',
	'block-mods/list-block/add-columns-attribute',
	addAttributes,
);

/**
 * Add Columns control to List block
 */
const addInspectorControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const {
			attributes: { columns },
			setAttributes,
			name,
		} = props;
		if (name !== 'core/list') {
			return <BlockEdit {...props} />;
		}
		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title={ __( 'Columns' ) } initialOpen={true}>
						<ButtonGroup aria-label={ __( 'Columns' ) }>
							{ [ "1", "2", "3", "4" ].map( ( columnValue ) => {
								return (
									<Button
										key={ columnValue }
										isPrimary={ columns === columnValue }
										onClick={ () => {
											setAttributes({ columns: columnValue });
										}}
									>
										{ columnValue }
									</Button>
								);
							} ) }
						</ButtonGroup>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withInspectorControl');
addFilter(
	'editor.BlockEdit',
	'block-mods/list-block/add-columns-controls',
	addInspectorControl,
);

/**
 * Add columns class to the block in the editor
 */
const addColumnsClassEditor = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const {
			attributes: { columns },
			className,
			name,
		} = props;

		if (name !== 'core/list') {
			return <BlockListBlock {...props} />;
		}

		return (
			<BlockListBlock
				{...props}
				className={classnames(className, { [`has-${columns}-columns`] : columns } )}
			/>
		);
	};
}, 'withClientIdClassName');
addFilter(
	'editor.BlockListBlock',
	'block-mods/button-block/add-columns-class-editor',
	addColumnsClassEditor,
);

/**
 * Add class to the block on the front end
 *
 * @param  {Object} props      Additional props applied to save element.
 * @param  {Object} block      Block type.
 * @param  {Object} attributes Current block attributes.
 * @return {Object}            Filtered props applied to save element.
 */
function addColumnsClassFrontEnd(props, block, attributes) {
	if ( block.name !== 'core/list' ) {
		return props;
	}
	const { className } = props;
	const { columns } = attributes;
	return assign({}, props, {
		className: classnames(className, { [`has-${columns}-columns`] : columns } ),
	});
}

// Comment out to test the PHP approach defined in block-mods.php
addFilter(
	'blocks.getSaveContent.extraProps',
	'block-mods/button-block/add-columns-class-public',
	addColumnsClassFrontEnd,
);
