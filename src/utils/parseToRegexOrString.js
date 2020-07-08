export default function parseToRegexOrString(str) {
  /* istanbul ignore next */
  const result =
    str.startsWith("/") && str.endsWith("/")
      ? new RegExp(str.slice(1, -1))
      : str;

  // // eslint-disable-next-line
  // console.log(str, result);
  return result;
}
