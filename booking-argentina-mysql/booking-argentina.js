const puppeteer = require('puppeteer');
//const ExcelJS = require('exceljs');
const fs = require('fs');
const randomUseragent = require('random-useragent');   // npm install random-useragent
const { get } = require('https');

// creo funcion , pongo el useragent
const initialization = async () => {
    const header = randomUseragent.getRandom();
    const browser = await puppeteer.launch();  // abre crom
    const page = await browser.newPage(); // cree un nuevo tag
    await page.setUserAgent(header);  // usa el useragen
    //await page.setViewport({with: 1920, height: 1080});   // hancho alto compu
    await page.goto('https://www.booking.com/searchresults.es.html?label=gen173nr-1FCAEoggI46AdIM1gEaAyIAQGYAQq4ARnIAQzYAQHoAQH4AQuIAgGoAgO4AsuH6ZgGwAIB0gIkMDU1YWVhNWUtYjc1NS00YTVhLWE4NzYtNmRlNGRkMGVmODFj2AIG4AIB&sid=6a0d65e8a01cac135af939438b57a90f&aid=304142&lang=es&sb_lp=1&src=index&error_url=https%3A%2F%2Fwww.booking.com%2Findex.es.html%3Flabel%3Dgen173nr-1FCAEoggI46AdIM1gEaAyIAQGYAQq4ARnIAQzYAQHoAQH4AQuIAgGoAgO4AsuH6ZgGwAIB0gIkMDU1YWVhNWUtYjc1NS00YTVhLWE4NzYtNmRlNGRkMGVmODFj2AIG4AIB%26sid%3D6a0d65e8a01cac135af939438b57a90f%26sb_price_type%3Dtotal%26%26&ss=Argentina&is_ski_area=&checkin_year=2022&checkin_month=11&checkin_monthday=5&checkout_year=2022&checkout_month=11&checkout_monthday=6&group_adults=2&group_children=0&no_rooms=1&b_h4u_keep_filters=&from_sf=1&ss_raw=arge&ac_position=1&ac_langcode=es&ac_click_type=b&dest_id=10&dest_type=country&place_id_lat=-36.8121&place_id_lon=-64.796&search_pageview_id=e6ae6e201b900269&search_selected=true&search_pageview_id=e6ae6e201b900269&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0&nflt=ht_id%3D204');   // vista este link
    //await page.screenshot({ path: 'example.png'});
    await page.waitForSelector('.b978843432');  // espera hasta que el selector tenga la clase

    let data = []
    const itemsList = await page.$$('div[data-testid="property-card"]'); // $$ traiga todo // elemento que se repite
    for (const item of itemsList){
        const name_hotel = await item.$('h3 a .fcab3ed991.a23c043802'); // de la lista de item quiero el precio. $ un elemento
        const price = await item.$('.fcab3ed991.bd73d13072'.replace('$', ' '));
        const tax = await item.$('.d8eab2cf7f.c257e924ca'.replace('+', ' '));
        const room = await item.$('.df597226dd');
        const qualification = await item.$('.b1e6dd8416.b48795b3df')
        //const punctuation = await item.$('.b5cd09854e.d10a6220b4')
        //const punctuation = await item.$('div[data-testid="review-score"]')
        //const availability = await item.$('.cb1f9edcd4')
        // const image = await item.$('div.ui-search-result__image a');



        // busque el objeto price y debuelva en una constante getprice el texto
        const getName = await page.evaluate(name_hotel => name_hotel.innerText, name_hotel);
        const getPrice = await page.evaluate(price => price.textContent, price);
        const getTax = await page.evaluate(tax => tax.innerText, tax);
        const getRoom = await page.evaluate(room => room.innerText, room);
        const getQualification = await page.evaluate(qualification => qualification.innerText, qualification);
        //const getPunctuation = await page.evaluate(punctuation => punctuation.innerText, punctuation);
        //const getAvailability = await page.evaluate(availability => availability.innerText, availability);
        //console.log('---->', getAvailability)
       
        // const getImage = await page.evaluate(image => image.getAttribute('src'), image);

        data.push( // c) al array de data le agregue la data que agarramos previamnete(en reColumns los key)
        {
            name: getName,
            price: getPrice,
            tax: getTax,
            room : getRoom,
            qualification : getQualification
        }
        )  
        
        //console.log(`Name hotel:${getName} Price: ${getPrice} Tax: ${getTax} Room: ${getRoom} Qualification: ${getQualification}`);
    }
    fs.writeFileSync('./booking-argentina.json', JSON.stringify(data, null, 2), 'utf8')
    await browser.close();

}


initialization();  // ejecuto 