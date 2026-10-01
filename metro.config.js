const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

// The repo IS the workspace root: the app lives here and the shared @ems/*
// packages are vendored under ./packages (reached via node_modules symlinks).
const projectRoot = __dirname;

/** @type {import('@react-native/metro-config').MetroConfig} */
const config = {
  watchFolders: [projectRoot],
  resolver: {
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')],
    unstable_enableSymlinks: true,
    unstable_enablePackageExports: true,
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
