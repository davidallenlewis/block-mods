import classnames from 'classnames';

const { addFilter } = wp.hooks;
const { assign, merge } = lodash;
const { createHigherOrderComponent } = wp.compose;

/**
 * Add Background Color attribute to Video block and Gradient Support
 *
 * @param  {Object} settings Original block settings
 * @param  {string} name     Block name
 * @return {Object}          Filtered block settings
 */
function addAttributes(settings, name) {
	if ( name === 'core/image' || name === 'core/video' || name === 'core/embed' || name === 'core/embed' || name === 'core/media-text' ) {
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
					"background": true,
					"gradients": true,
					"link": false,
					"text": false
				},
			}),
		});
	}
	return settings;
}
addFilter(
	'blocks.registerBlockType',
	'block-mods/multiple-blocks/background-settings',
	addAttributes,
);

/**
 * Add background color class to the block in the editor
 */
const addBackgroundColorClassEditor = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const {
			attributes: { gradient, backgroundColor },
			className,
			name,
		} = props;
		if ( name !== 'core/image' && name !== 'core/video' && name !== 'core/embed' && name !== 'core/media-text' ) {
			return <BlockListBlock {...props} />;
		}
		return (
			<BlockListBlock
				{...props}
				className={classnames(className, { [`has-${gradient}-gradient-background`] : gradient }, { [`has-${backgroundColor}-background-color`] : backgroundColor } ) }
			/>
		);
	};
}, 'addBackgroundColorClassEditor');
addFilter(
	'editor.BlockListBlock',
	'block-mods/multiple-blocks/add-editor-class-editor',
	addBackgroundColorClassEditor,
);


/**
 * Add class to the block on the front end / html markup
 *
 * @param  {Object} props      Additional props applied to save element.
 * @param  {Object} block      Block type.
 * @param  {Object} attributes Current block attributes.
 * @return {Object}            Filtered props applied to save element.
 */
function addSizeClassFrontEnd(props, block, attributes) {
	const { className } = props;
	const { gradient, backgroundColor } = attributes;
	if ( block.name === 'core/image' || block.name === 'core/video' || block.name === 'core/embed' || block.name === 'core/media-text' ) {
		return assign({}, props, {
			className: classnames(className, { [`has-${gradient}-gradient-background`] : gradient }, { [`has-${backgroundColor}-background-color`] : backgroundColor } ),
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