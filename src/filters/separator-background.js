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
		delete settings.attributes.customColor;
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
	addAttributes,
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
				className={ classnames(className, { [`has-${backgroundColor}-background-color`] : backgroundColor }, { [`has-${gradient}-gradient-background`] : gradient } ) }
			/>
		);
	};
}, 'withClientIdClassName');
addFilter(
	'editor.BlockListBlock',
	'block-mods/separator-block/add-editor-class',
	addColourClassEditor,
);