import { IdAttributePlugin } from '@11ty/eleventy';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';
import esbuild from './_source/_utilities/esbuild.js';
import generateFavicons from './_source/_utilities/generate-favicons.js';
import inlineCSS from './_source/_utilities/inlineCSS.js';

export default async function (eleventyConfig) {
  // Generate favicons at build start
  eleventyConfig.on('eleventy.before', async () => {
    try {
      await generateFavicons();
    } catch (error) {
      console.warn('Could not generate favicons:', error);
    }
  });

  /* --------------------------------------------------------------------------
  Plugins, shortcodes
  -------------------------------------------------------------------------- */
  eleventyConfig.addPlugin(esbuild);
  eleventyConfig.addPlugin(IdAttributePlugin);
  eleventyConfig.addAsyncShortcode('inlineCSS', inlineCSS);

  // Every <img> in the built HTML becomes a responsive <picture>.
  // Reference source images by absolute path, e.g. /assets/images/photo.jpg.
  // Opt a single image out with the `eleventy:ignore` attribute.
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ['avif', 'webp', 'jpeg'],
    widths: [400, 800, 1200, 1600],
    sharpAvifOptions: { quality: 65 },
    sharpWebpOptions: { quality: 75 },
    sharpJpegOptions: { quality: 80 },
    htmlOptions: {
      imgAttributes: {
        loading: 'lazy',
        decoding: 'async',
      },
    },
  });

  /* --------------------------------------------------------------------------
  Files & folders
  -------------------------------------------------------------------------- */
  eleventyConfig.ignores.add('.DS_Store');
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough');
  // CSS is inlined into the page head by the inlineCSS shortcode
  eleventyConfig.addWatchTarget('./_source/assets/css/');
  eleventyConfig.addPassthroughCopy('_source/assets/fonts');
  eleventyConfig.addPassthroughCopy('_source/assets/images/icons');
  eleventyConfig.addPassthroughCopy('_source/assets/images/logo.svg');
  eleventyConfig.addPassthroughCopy('_source/assets/images/og-image.png');
  eleventyConfig.addPassthroughCopy({ '_source/_redirects': '_redirects' });

  return {
    dir: {
      input: '_source',
      output: '_site',
      layouts: '_layouts',
      includes: '_includes',
    },
    templateFormats: ['html', 'md', 'liquid'],
    htmlTemplateEngine: 'liquid',
  };
}
