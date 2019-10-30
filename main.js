const puppeteer = require('puppeteer');
const fs = require('fs');

(async()=>{
    // configure folder and http url path
    // the folder contain all the html file
    const folderPath='E:\\*********\\'
    const baseURL='http://127.0.0.1:4000/********/'


    let fileNames=fs.readdirSync(folderPath,'utf8')
    fileNames=await fileNames.filter(filename=>filename.includes('.html'))
    const browser = await puppeteer.launch({headless:true})
    const page = await browser.newPage()
    for (i=0,size=fileNames.length;i<size;i++){
        await page.goto(`${baseURL}${fileNames[i]}`)

        let html =await page.content()
        let svgInline= await page.evaluate(() => document.querySelector('svg').outerHTML)
        if (!fs.existsSync(`${folderPath}svgs\\`)){
            fs.mkdirSync(`${folderPath}svgs\\`);
        }
        fs.writeFile(`${folderPath}svgs\\${fileNames[i].replace('.html','.svg')}`,svgInline,(err)=>{
            if (err){
                console.error(err)
                return
            }
            console.log(`Write SVG finised ${i}/${size}`)})
        delay(1000)
    }
    await browser.close()
})()

function delay(timeout){
    return new Promise((resolve)=>{
        setTimeout(resolve,timeout)
    })
}
