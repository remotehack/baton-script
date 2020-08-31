import frontmatter from "./lib/frontmatter.js";
const purify = DOMPurify(window);

const heading_name_renderer = {
  heading(text, level) {
    return `
            <h${level}>${text}</h${level}>
            `;
  },
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

function highlight(target, names) {
  //https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
  const treeWalker = document.createTreeWalker(output, NodeFilter.SHOW_ELEMENT);

  var node = treeWalker.nextNode();
  let matching = false;

  while (node) {
    const isName = names.includes(node.innerText);
    if (isName && node.tagName === "H3") {
      if (node.innerText === target) {
        matching = true;
      } else {
        matching = false;
      }
    }

    // We don't want to apply the toggle to blockquotes
    if (["P", "H3"].includes(node.tagName)) {
      node.classList.toggle("active", matching);
      node.classList.toggle("inactive", !matching);
    }

    node = treeWalker.nextSibling();
  }
}

fetch("./example.md")
  .then((res) => res.text())
  .then((text) => {
    const [front, body] = frontmatter(text);

    meta.innerText = JSON.stringify(front, null, 2);

    document.querySelector("#title").innerText = front.title || "A thing";
    document.querySelector("#by").innerText = front.by || "-";

    // console.log(front);

    const names = Object.keys(front.characters).map((n) => n.toUpperCase());

    const characterList = document.querySelector("ul#characters");
    for (const [name, about] of Object.entries(front.characters)) {
      const a = document.createElement("a");
      a.href = "#" + name;
      a.innerText = name;
      const li = document.createElement("li");
      li.appendChild(a);

      characterList.append(li);
    }

    const html = purify.sanitize(marked(body));

    output.innerHTML = html;
    console.error(
      "Uncaught TypeError: Cannot read property 'hi ben' of undefined"
    );

    const target = document.location.hash.slice(1).toUpperCase();
    highlight(target, names);

    window.addEventListener("hashchange", () => {
      const target = document.location.hash.slice(1).toUpperCase();
      highlight(target, names);
    });
  });
