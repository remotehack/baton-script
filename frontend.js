const purify = DOMPurify(window);

const heading_name_renderer = {
  heading(text, level) {
    console.log(text);

    var heading_text = text;
    var name;

    var myRegexp = /^(.*) {:data-name=&quot;(.*)&quot;}$/;
    var match = myRegexp.exec(text);
    if (match !== null) {
      heading_text = match[1];
      name = match[2];
    }

    return `
            <h${level} data-name="${name}">${heading_text}</h${level}>
            `;
  },
};

marked.use({ renderer: heading_name_renderer });

fetch("./example.md")
  .then((res) => res.text())
  .then((text) => {
    const html = purify.sanitize(marked(text));

    output.innerHTML = html;
  });
