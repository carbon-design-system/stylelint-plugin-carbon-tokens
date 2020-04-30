export default function isValidOption(option) {
  // // eslint-disable-next-line
  // console.dir(option);

  /* istanbul ignore next */
  const arrOpts = Array.isArray(option) ? option : [option];

  for (const opt of arrOpts) {
    if (opt.startsWith("/")) {
      /* istanbul ignore next */
      if (!opt.endsWith("/")) {
        // eslint-disable-next-line no-console
        console.warn(
          "Invalid option supplied, expect regular expression or string."
        );

        return false;
      }
    }
  }

  return true;
}
