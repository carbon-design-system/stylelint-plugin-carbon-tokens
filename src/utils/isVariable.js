export default function isVariable(string) {
  return (
    string !== undefined &&
    (string.startsWith("$") ||
      string.startsWith("--") ||
      string.startsWith("var(--"))
  );
}
