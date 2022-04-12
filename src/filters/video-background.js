import classnames from 'classnames';

const { addFilter } = wp.hooks;
const { assign, merge } = lodash;
const { createHigherOrderComponent } = wp.compose;

/**
 * Add Background Color attribute to Video block
 *
 * @param  {Object} settings Original block settings
 * @param  {string} name     Block name
 * @return {Object}          Filtered block settings
 */
function addAttributes(settings, name) {
	if (name === 'core/video') {
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
	'intro-to-filters/video-block/add-attributes',
	addAttributes,
);


/**
 * Add Background Color editor control to Video block by filtering "supports"
 */
function addVideoBackground(settings, name) {
	if (name === 'core/video') {
		return assign({}, settings, {
			supports: merge(settings.supports, {
				color: {
					"gradients": true
				},
			}),
		});
	}
	return settings;
}
addFilter(
	'blocks.registerBlockType',
	'intro-to-filters/cover-block/alignment-settings',
	addVideoBackground,
);


/**
 * Add background color class to the block in the editor
 */
const addBackgroundColorClassEditor = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const {
			attributes: { gradient },
			className,
			name,
		} = props;

		if (name !== 'core/video') {
			return <BlockListBlock {...props} />;
		}

		return (
			<BlockListBlock
				{...props}
				className={classnames(className, gradient ? `has-gradient-${gradient}` : '')}
			/>
		);
	};
}, 'withClientIdClassName');
addFilter(
	'editor.BlockListBlock',
	'intro-to-filters/video-block/add-editor-class',
	addBackgroundColorClassEditor,
);

