const puppeteer = require("puppeteer");

let browser, page;

beforeEach( async ()=>{
    browser = await puppeteer.launch({
        headless: true,
        args:['--no-sandbox']
    });

    page = await browser.newPage();
    await page.goto("http://localhost:3000")
}, 20000)


test('The header has correct text', async () => {
 
    const text = await page.$eval('a.brand-logo', el => el.innerHTML)

    expect(text).toEqual('Blogster');
}, 20000)

test('clicking login starts oatuh flow', async () => {
    
})

