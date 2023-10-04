const scrapeCategory = (browser,url) => new Promise(async (resolve,reject) => {
    try {
        let page = await browser.newPage();
        console.log(">> Mở tab mới ......")
        await page.goto(url)
        console.log(">> Truy cập vào " + url)
        //  đợi cho nó load xong 
        await page.waitForSelector('#webpage')
        console.log(">> Web đã load xong ......")

        // $eval document.queryselector
        // $$eval document.queryselectorAll

        const dataCategory = await page.$$eval('#navbar-menu > ul >li',els =>{
            dataCategory = els.map(el => {
                return {
                    category : el.querySelector('a').innerText,
                    link : el.querySelector('a').href
                }
            })
            return dataCategory
        })
        await page.close()
        console.log("tag đã đóng")
        resolve(dataCategory)
    } catch (error) {
        console.log('lỗi ở scrapper category ' + error)
        reject(error)
    }
})
const scrapper = (browser,url)=> new Promise(async (resolve,reject) => {
    try {
        let page = await browser.newPage();
        console.log(">> Mở tab mới ......")
        await page.goto(url)
        console.log(">> Truy cập vào " + url)
        //  đợi cho nó load xong 
        await page.waitForSelector('#main')
        console.log(">> Web đã load xong ......")

        const scrapedData = {}


        //  lấy header
        const headerData = await page.$eval('header', (el) => {
            return {
                title : el.querySelector('h1').innerText,
                description : el.querySelector('p').innerText     
            }
        })
        scrapedData.header = headerData


        //  lấy links detail item
        const detailLinks = await page.$$eval('#left-col > .section-post-listing ul li', els=>{
            detailLinks = els.map(el=>{
                return el.querySelector('.post-meta > h3 > a').href
            })
            return detailLinks
        })
        // console.log(detailLinks)

        const scrapperDetail = async(link)=> new Promise(async(resolve, reject)=>{
            try {
                let pageDetail = await browser.newPage()
                await pageDetail.goto(link)
                console.log('>> truy cập ' + link )
                await pageDetail.waitForSelector('#main')
                console.log('>> load page thành công')

                const detailData = {}

                // img
                const images = await pageDetail.$$eval('#left-col > article > div.post-images > div.images-swiper-container > div.swiper-wrapper > div.swiper-slide', els =>{
                    images = els.map(el => {
                        const imgElement = el.querySelector('img');
                        if (imgElement) {
                            return imgElement.src;
                        } else {
                            return null;
                        }
                    })
                    return images
                })

                detailData.images = images


                const header = await pageDetail.$eval('header.page-header', (el) =>{ 
                    return {
                        title: el.querySelector('h1 > a').innerText,
                        star : el.querySelector('h1 > span')?.className.replace(/^\D+/g, ''),
                        class : {
                            content : el.querySelector('p').innerText,
                            classType : el.querySelector('p > a > strong').innerText
                        },
                        address : el.querySelector('address').innerText,
                        attributes : {
                            price : el.querySelector('div.post-attributes > .price > span').innerText,
                            acreage : el.querySelector('div.post-attributes > .acreage > span').innerText,
                            published : el.querySelector('div.post-attributes > .published > span').innerText,
                            hashtag : el.querySelector('div.post-attributes > .hashtag > span').innerText,
                        }
                    }
                })

                detailData.header = header


                // thông tin mô tả 

                // const mainContent = {}
                const mainContentHeader = await pageDetail.$eval('#left-col > article.the-post > section.post-main-content', (el) =>{
                    return el.querySelector('div.section-header > h2').innerText
                })

                const mainContentContent = await pageDetail.$$eval('#left-col > article.the-post > section.post-main-content > .section-content > p', (els) =>{
                    return mainContentContent = els.map(el => el.innerText)
                })

                detailData.mainContent = {
                    header : mainContentHeader,
                    content : mainContentContent
                }


                // đặc điểm tin đăng


                const overviewHeader = await pageDetail.$eval('#left-col > article.the-post > section.post-overview', (el) =>{
                    return el.querySelector('div.section-header > h3').innerText
                })

                const overviewContent = await pageDetail.$$eval('#left-col > article.the-post > section.post-overview > .section-content > table.table > tbody > tr', (els) =>{
                    return mainContentContent = els.map(el => ({
                        name : el.querySelector('td:first-child').innerText,
                        content : el.querySelector('td:last-child').innerText
                    }))
                })

                detailData.overview = {
                    header : overviewHeader,
                    content : overviewContent
                }


                //  thông tin liên hệ 

                const contactHeader = await pageDetail.$eval('#left-col > article.the-post > section.post-contact', (el) =>{
                    return el.querySelector('div.section-header > h3').innerText
                })

                const contactContent = await pageDetail.$$eval('#left-col > article.the-post > section.post-contact > .section-content > table.table > tbody > tr', (els) =>{
                    return mainContentContent = els.map(el => ({
                        name : el.querySelector('td:first-child').innerText,
                        content : el.querySelector('td:last-child').innerText
                    }))
                })
                detailData.contact = {
                    header : contactHeader,
                    content : contactContent
                }

                // console.log(detailData)
                await pageDetail.close()    
                console.log('>> đã đóng tab')
                resolve(detailData)
            } catch (error) {
                console.log('lấy data detail lỗi ' + error)
                reject()
            }
        })

        const details = []
        for (let link of detailLinks){
            const detail = await scrapperDetail(link)
            details.push(detail)
        }


        scrapedData.body = details


        // await browser.close()
        console.log('>> trình duyệt đã đóng')
        resolve(scrapedData)
    } catch (error) {
        reject()
    }
})

module.exports = {
    scrapeCategory,
    scrapper
}
