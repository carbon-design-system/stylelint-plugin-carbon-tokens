export default function splitValueList(value) {
  // NOTE: inside function as otherwise regex.lastIndex may be non-zero on second call
  const commaSplitRegex = /,(?=(((?!\)).)*\()|[^()]*$)/g;

  const values = [];
  let lastPos = 0;
  let matches;

  while ((matches = commaSplitRegex.exec(value)) !== null) {
    values.push(value.substring(lastPos, matches.index).trim());
    lastPos = commaSplitRegex.lastIndex;
  }

  /* istanbul ignore else */
  if (lastPos < value.length) {
    values.push(value.substring(lastPos).trim());
  }

  return values;
}
