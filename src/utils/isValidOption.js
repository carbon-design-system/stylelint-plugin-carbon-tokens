export default function isValidOption(option) {
  const arrOpts = Array.isArray(option) ? option : [option];

  // eslint-disable-next-line
  console.log("**************************");

  for (const opt of arrOpts) {
    if (opt.startsWith("/")) {
      if (!opt.endsWith("/")) {
        return false;
      }
    }
  }

  return false;
}
