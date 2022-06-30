module.exports = {
  siteUrl: process.env.SITE_URL || "https://analyticz.marcusnerloe.dk",
  generateRobotsTxt: true, // (optional)
  //exclude: ["/server-sitemap.xml"], // <= exclude here
  robotsTxtOptions: {
    /*additionalSitemaps: [
      "https://robotbar.dk/server-sitemap.xml", // <==== Add here
    ],*/
  },
};
