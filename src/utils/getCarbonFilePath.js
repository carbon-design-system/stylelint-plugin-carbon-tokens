import path from "path";

const modulesPathIndex = __dirname.indexOf("/node_modules/");
const inNodeModules = modulesPathIndex > -1;
//
const modulesPath = inNodeModules
  ? __dirname.substr(0, modulesPathIndex + 14) // in node modules
  : path.join(__dirname, "../../../"); //

const packagesInfo = {
  layout: {
    nodeModules: "@carbon/layout/scss/generated/",
    srcModules: "layout/scss/generated",
  },
};

const getCarbonFilePath = (pkg, file) => {
  const packageInfo = packagesInfo[pkg];
  const packagePath = path.join(
    modulesPath,
    `${inNodeModules ? packageInfo.nodeModules : packageInfo.srcModules}`
  );
  const filePart = (packageInfo.file && packageInfo.file[file]) || file;

  return path.join(packagePath, filePart);
};

export default getCarbonFilePath;
