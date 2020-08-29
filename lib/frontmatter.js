const split = "\n---\n";

export default function frontmatter(str) {
  const idx = str.indexOf(split);

  if (idx > -1) {
    try {
      const data = jsyaml.load(str.slice(0, idx));

      return [data, str.slice(idx + split.length)];
    } catch (e) {}
  }

  return [{}, str];
}
