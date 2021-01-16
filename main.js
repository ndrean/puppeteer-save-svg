const puppeteer = require("puppeteer");
const fs = require("fs").promises;

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  var contentHtml = await fs.readFile("./index.html", "utf8");
  await page.setContent(contentHtml);

  const svgInline = await page.evaluate(() => {
    const doc = document.querySelector("svg");
    doc.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const style = document.createElement("style");
    style.innerHTML = `
    body {
      font: 300 14px 'Helvetica Neue', Helvetica;
    }

    .node rect {
      stroke: #333;
      fill: #fff;
    }

    .edgePath path {
      stroke: #333;
      fill: #333;
      stroke-width: 1.5px;
    }`;

    doc.appendChild(style);
    const text = doc.toString();
    text.replace(/url\(([^)]+)#/g, "");
    const parser = new DOMParser();
    const innertext = parser.parseFromString(text, "application/xml");
    doc.appendChild = innertext;
    return doc.outerHTML;
  });

  await fs.writeFile(`toto.svg`, svgInline);
  await browser.close();
})();
