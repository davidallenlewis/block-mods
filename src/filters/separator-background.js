import classnames from 'classnames';

const { addFilter } = wp.hooks;
const { assign, merge } = lodash;
const { createHigherOrderComponent } = wp.compose;

/**
 * Add Background Color attribute to Separator block
 *
 * @param  {Object} settings Original block settings
 * @param  {string} name     Block name
 * @return {Object}          Filtered block settings
 */
function addAttributes(settings, name) {
	if (name === 'core/separator') {
		delete settings.attributes.color;
		return assign({}, settings, {
			attributes: merge(settings.attributes, {
				backgroundColor: {
					type: 'string',
					default: '',
				},
				gradient: {
					type: 'string',
					default: '',
				},
			}),
		});
	}
	return settings;
}
addFilter(
	'blocks.registerBlockType',
	'block-mods/separator-block/add-attributes',
	addAttributes,
);

/**
 * Add Background Color editor control to separator block by filtering "supports"
 */
function addSeparatorBackground(settings, name) {
	if (name === 'core/separator') {
		return assign({}, settings, {
			supports: merge(settings.supports, {
				color: {
					"text": false,
					"gradients": true
				},
			}),
		});
	}
	return settings;
}
addFilter(
	'blocks.registerBlockType',
	'block-mods/separator-block/alignment-settings',
	addSeparatorBackground,
);


/**
 * Add color class to the block in the editor
 */
const addColourClassEditor = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const {
			attributes: { backgroundColor, gradient },
			className,
			name,
		} = props;
		if (name !== 'core/separator') {
			return <BlockListBlock {...props} />;
		}
		return (
			<BlockListBlock
				{...props}
				className={classnames(className, backgroundColor ? `has-${backgroundColor}-background-color` : gradient ? `has-${gradient}-gradient-background` : '')}
			/>
		);
	};
}, 'withClientIdClassName');
addFilter(
	'editor.BlockListBlock',
	'block-mods/separator-block/add-editor-class',
	addColourClassEditor,
);