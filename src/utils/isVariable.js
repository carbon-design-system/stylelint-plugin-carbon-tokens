export default function isVariable(string) {
  return (
    string.startsWith("$") ||
    string.startsWith("--") ||
    string.startsWith("var(--")
  );
}
