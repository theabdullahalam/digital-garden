const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {

  // copy styles
  eleventyConfig.addPassthroughCopy("./src/css/");

  // watch styles
  eleventyConfig.addWatchTarget("./src/css/");

  // copy fonts
  eleventyConfig.addPassthroughCopy("./src/fonts/");

  // copy img
  eleventyConfig.addPassthroughCopy("./src/img/");

  // readable date filter
  eleventyConfig.addFilter("readablePostDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
        zone: "Asia/Kolkata",
      }).setLocale('en').toLocaleString(DateTime.DATE_FULL);
  });


  // open broswer on run
  // eleventyConfig.setBrowserSyncConfig({
  //   open: true,
  // });

  // create collection of tags
  eleventyConfig.addCollection("tagsList", function (collectionApi) {
    const tagsList = new Set();
    collectionApi.getAll().map(item => {
      if (item.data.tags) { // handle pages that don't have tags
        item.data.tags.map(tag => tagsList.add(tag))
      }
    });
    return tagsList;
  });

  return {
    dir: {
      // default: [site root]
      input: "src",
    },
  };
};