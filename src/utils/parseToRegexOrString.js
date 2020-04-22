export default function parseToRegexOrString(str) {
  /* istanbul ignore next */
  return str.startsWith("/") && str.endsWith("/")
    ? new RegExp(str.slice(1, -1))
    : str;
}
