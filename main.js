const puppeteer = require("puppeteer");
const fs = require("fs").promises;

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  var contentHtml = await fs.readFile("./index.html", "utf8");
  await page.setContent(contentHtml);

  let svgInline = await page.evaluate(() => {
    const doc = document.querySelector("svg");
    doc.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    return doc.outerHTML;
  });
  await fs.writeFile(`toto.svg`, svgInline);
  await browser.close();
})();
