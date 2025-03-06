const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
//   config.transformer.assetPlugins = ["react-native-svg-transformer"];
  return config;
})();
