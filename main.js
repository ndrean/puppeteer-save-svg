const puppeteer = require('puppeteer');
const fs = require('fs');

(async()=>{
    // 配置文件夹路径和http地址
    const folderPath='E:\\Nextcloud\\weiwei\\cityindex\\treemap\\'
    const baseURL='http://127.0.0.1:4000/treemap/'


    let fileNames=fs.readdirSync(folderPath,'utf8')
    fileNames=await fileNames.filter(filename=>filename.includes('.html'))
    const browser = await puppeteer.launch({headless:true})
    const page = await browser.newPage()
    for (i=0,size=fileNames.length;i<size;i++){
        await page.goto(`${baseURL}${fileNames[i]}`,{ waitUntil: 'networkidle0' ,timeout:'0'})

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
