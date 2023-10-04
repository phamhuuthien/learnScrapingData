const scrappers = require('./scrapper')
const fs = require('fs')
const scrapeControllers = async(browserInstance)=>{
    const url = 'https://phongtro123.com/'
    const indexs = [1,2,3,4]

    try {
        let browser = await browserInstance

        //  gọi hàm cào ở file scrape

        const categories = await scrappers.scrapeCategory(browser,url)
        const selectedCategory = categories.filter((category,index) => indexs.some(i => i === index))
        let result = await scrappers.scrapper(browser,selectedCategory[0].link)

        // ghi dữ liệu vào file json 
        fs.writeFile('chothuephongtro.json',JSON.stringify(result),(err)=>{
            if(err) console.log('ghi dữ liệu vào file thất bại '+ err)
            console.log('thêm dữ liệu thành công')
        })


        let result1 = await scrappers.scrapper(browser,selectedCategory[1].link)
        fs.writeFile('nhachothue.json',JSON.stringify(result1),(err)=>{
            if(err) console.log('ghi dữ liệu vào file thất bại '+ err)
            console.log('thêm dữ liệu thành công')
        })


        let result2 = await scrappers.scrapper(browser,selectedCategory[2].link)
        fs.writeFile('chothuecanho.json',JSON.stringify(result2),(err)=>{
            if(err) console.log('ghi dữ liệu vào file thất bại '+ err)
            console.log('thêm dữ liệu thành công')
        })

        let result3 = await scrappers.scrapper(browser,selectedCategory[3].link)
        fs.writeFile('matbangvanphong.json',JSON.stringify(result3),(err)=>{
            if(err) console.log('ghi dữ liệu vào file thất bại '+ err)
            console.log('thêm dữ liệu thành công')
        })

        //  đống trình duyệt
        browser.close()
    } catch (error) {
        console.log('lỗi scrapper controller ' + error)
    }
}


module.exports = scrapeControllers

