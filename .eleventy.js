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

  // copy garden media
  eleventyConfig.addPassthroughCopy("./src/garden/media");

  // copy js
  eleventyConfig.addPassthroughCopy("./src/js/");

  // readable date filter
  eleventyConfig.addFilter("readablePostDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
        zone: "Asia/Kolkata",
      }).setLocale('en').toLocaleString(DateTime.DATE_FULL);
  });

  // convert "media/" to "/garden/media/"
  eleventyConfig.addFilter("mediaPath", (content_str) => {
    return content_str.replace(/media\//g, "/garden/media/")
  });


  // open broswer on run
  // eleventyConfig.setBrowserSyncConfig({
  //   open: true,
  // });

  // create collection of tags
  eleventyConfig.addCollection("tagsList", function (collectionApi) {
    let tagsList = [];
    collectionApi.getAll().map(item => {
      if (item.data.tags) { // handle pages that don't have tags
        item.data.tags.map(tag => {
            if (tag !== "garden") {
              tagsList.push(tag)
            }        
        });
      }
    });
    tagsList.sort()
    tagsList.splice(0, 0, "garden")
    return new Set(tagsList);
  });

  return {
    dir: {
      // default: [site root]
      input: "src",
    },
  };
};