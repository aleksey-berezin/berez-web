import markdownIt from 'markdown-it';
import esbuild from './_source/_utilities/esbuild.js';
import lightingcss from './_source/_utilities/lightningcss.js';
import image, { heroImage, bgImage } from './_source/_utilities/image.js';
import style from './_source/_utilities/style.js';
import inlineCSS from './_source/_utilities/inlineCSS.js';
import setVar from './_source/_utilities/setVar.js';
import fullDate from './_source/_utilities/fullDate.js';
import markdownify from './_source/_utilities/markdownify.js';
import generateFavicons from './_source/_utilities/generate-favicons.js';
import { IdAttributePlugin } from '@11ty/eleventy';

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
  Plugins, bundles, shortcodes, filters
  -------------------------------------------------------------------------- */
  eleventyConfig.addPlugin(esbuild);
  eleventyConfig.addPlugin(lightingcss);
  eleventyConfig.addPlugin(IdAttributePlugin);
  eleventyConfig.addBundle('css', { transforms: [style] });
  eleventyConfig.addAsyncShortcode('inlineCSS', inlineCSS);
  eleventyConfig.addShortcode('image', image);
  eleventyConfig.addShortcode('heroImage', heroImage);
  eleventyConfig.addShortcode('bgImage', bgImage);
  eleventyConfig.addPairedShortcode('setVar', setVar);
  eleventyConfig.addFilter('fullDate', fullDate);
  eleventyConfig.addFilter('markdownify', markdownify);
  eleventyConfig.addFilter('url_encode', (str) => encodeURIComponent(str));

  /* --------------------------------------------------------------------------
  MarkdownIt settings
  -------------------------------------------------------------------------- */
  const markdownItOptions = {
    html: true,
    typographer: true,
  };
  eleventyConfig.setLibrary('md', markdownIt(markdownItOptions));

  /* --------------------------------------------------------------------------
  Files & folders
  -------------------------------------------------------------------------- */
  eleventyConfig.ignores.add('.DS_Store');
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough');
  eleventyConfig.addPassthroughCopy('_source/assets/fonts');
  eleventyConfig.addPassthroughCopy('_source/assets/images');
  // OG images are generated directly in _site during build, no copy needed

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
