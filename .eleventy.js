module.exports = function (eleventyConfig) {

  // copy styles
  eleventyConfig.addPassthroughCopy("./src/css/");

  // watch styles
  eleventyConfig.addWatchTarget("./src/css/");


  // open broswer on run
  eleventyConfig.setBrowserSyncConfig({
    open: true,
  });

  return {
    dir: {
      // default: [site root]
      input: "src",
    },
  };
};