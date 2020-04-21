export default function splitValueList(value) {
  // NOTE: inside function as otherwise regex.lastIndex may be non-zero on second call
  const commaSplitRegex = /,(?=(((?!\)).)*\()|[^()]*$)/g;

  const values = [];
  let lastPos = 0;
  let matches;
  let count = 0;

  while ((matches = commaSplitRegex.exec(value)) !== null) {
    count += 1;
    values.push(value.substring(lastPos, matches.index).trim());
    lastPos = commaSplitRegex.lastIndex;

    if (count === 3) {
      break;
    }
  }

  if (lastPos < value.length) {
    values.push(value.substring(lastPos).trim());
  }

  return values;
}
