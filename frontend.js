import frontmatter from "./lib/frontmatter.js";
const purify = DOMPurify(window);

const heading_name_renderer = {
  // heading(text, level) {
  //   console.log(text);
  //   var heading_text = text;
  //   var name;
  //   var myRegexp = /^(.*) {:data-name=&quot;(.*)&quot;}$/;
  //   var match = myRegexp.exec(text);
  //   if (match !== null) {
  //     heading_text = match[1];
  //     name = match[2];
  //   }
  //   return `
  //           <h${level} data-name="${name}">${heading_text}</h${level}>
  //           `;
  // },
  // blockquote(quote) {
  //   const quoteRegex = /^(>\s*?)$/;
  //   const matches = quoteRegex.exec(quote);
  //   console.log("Quote", quote, matches);
  //   return `
  //           <blockquote>${quote}</blockquote>
  //           `;
  // },
};

marked.use({ renderer: heading_name_renderer });

fetch("./example.md")
  .then((res) => res.text())
  .then((text) => {
    const [front, body] = frontmatter(text);

    meta.innerText = JSON.stringify(front, null, 2);

    document.querySelector("#title").innerText = front.title || "A thing";
    document.querySelector("#by").innerText = front.by || "-";

    const html = purify.sanitize(marked(body));

    output.innerHTML = html;
  });
