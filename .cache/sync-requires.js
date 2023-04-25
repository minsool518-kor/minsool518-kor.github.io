const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---node-modules-gatsby-plugin-offline-app-shell-js": hot(preferDefault(require("C:\\Users\\Doooooooo\\Desktop\\mosa-master\\node_modules\\gatsby-plugin-offline\\app-shell.js"))),
  "component---src-pages-404-js": hot(preferDefault(require("C:\\Users\\Doooooooo\\Desktop\\mosa-master\\src\\pages\\404.js"))),
  "component---src-pages-automatic-js": hot(preferDefault(require("C:\\Users\\Doooooooo\\Desktop\\mosa-master\\src\\pages\\automatic.js"))),
  "component---src-pages-index-js": hot(preferDefault(require("C:\\Users\\Doooooooo\\Desktop\\mosa-master\\src\\pages\\index.js")))
}

