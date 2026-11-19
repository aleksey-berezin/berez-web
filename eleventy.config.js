import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';

export default function (eleventyConfig) {
	// Every <img> in the built HTML becomes a responsive <picture>.
	// Photos live in _source/photos and are referenced as /photos/name.jpg.
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		formats: ['avif', 'webp', 'jpeg'],
		widths: [400, 800, 1200, 1600],
		htmlOptions: {
			imgAttributes: { loading: 'lazy', decoding: 'async' },
		},
	});

	// Everything in _source/public is copied to the site root as-is.
	eleventyConfig.addPassthroughCopy({ '_source/public': '/' });

	return {
		dir: { input: '_source', output: '_site' },
	};
}
