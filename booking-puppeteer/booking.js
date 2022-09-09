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
    await page.goto('https://www.booking.com/searchresults.es.html?label=gen173nr-1FCAEoggI46AdIM1gEaAyIAQGYAQq4ARnIAQzYAQHoAQH4AQuIAgGoAgO4AsuH6ZgGwAIB0gIkMDU1YWVhNWUtYjc1NS00YTVhLWE4NzYtNmRlNGRkMGVmODFj2AIG4AIB&lang=es&sid=6a0d65e8a01cac135af939438b57a90f&sb=1&sb_lp=1&src=index&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Findex.es.html%3Flabel%3Dgen173nr-1FCAEoggI46AdIM1gEaAyIAQGYAQq4ARnIAQzYAQHoAQH4AQuIAgGoAgO4AsuH6ZgGwAIB0gIkMDU1YWVhNWUtYjc1NS00YTVhLWE4NzYtNmRlNGRkMGVmODFj2AIG4AIB%26sid%3D6a0d65e8a01cac135af939438b57a90f%26sb_price_type%3Dtotal%26%26&ss=C%C3%B3rdoba%2C+Provincia+de+C%C3%B3rdoba%2C+Argentina&is_ski_area=&ssne=R%C3%ADo+de+Janeiro&ssne_untouched=R%C3%ADo+de+Janeiro&checkin_year=2022&checkin_month=9&checkin_monthday=18&checkout_year=2022&checkout_month=9&checkout_monthday=19&group_adults=2&group_children=0&no_rooms=1&b_h4u_keep_filters=&from_sf=1&search_pageview_id=a06d89a6aa4c0094&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0&ac_position=2&ac_langcode=es&ac_click_type=b&dest_id=-983417&dest_type=city&iata=COR&place_id_lat=-31.416555&place_id_lon=-64.1837&search_pageview_id=a06d89a6aa4c0094&search_selected=true&ss_raw=arge');   // vista este link
    //await page.screenshot({ path: 'example.png'});
    await page.waitForSelector('.b978843432');  // espera hasta que el selector tenga la clase

    let data = []
    const itemsList = await page.$$('div[data-testid="property-card"]'); // $$ traiga todo // elemento que se repite
    for (const item of itemsList){
        const name_hotel = await item.$('h3 a .fcab3ed991.a23c043802'); // de la lista de item quiero el precio. $ un elemento
        const price = await item.$('.fcab3ed991.bd73d13072');
        const tax = await item.$('.d8eab2cf7f.c257e924ca');
        const room = await item.$('.df597226dd');
        const qualification = await item.$('.b1e6dd8416.b48795b3df')
        //const punctuation = await item.$('.b5cd09854e.d10a6220b4')
        //const punctuation = await item.$('div[data-testid="review-score"]')
        //const availability = await item.$('.cb1f9edcd4')
        // const image = await item.$('div.ui-search-result__image a');



        // busque el objeto price y debuelva en una constante getprice el texto
        const getName = await page.evaluate(name_hotel => name_hotel.innerText, name_hotel);
        const getPrice = await page.evaluate(price => price.innerText, price);
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
        //console.log(`Name: ${getName} -- Price: ${getPrice} -- Link: ${getImage}`);
        // console.log(`Name hotel: ${getName} -- Price: ${getPrice} -- Tax: ${getTax} -- Room: ${getRoom}  -- Qualification: ${getQualification}`);
        //console.log(`Name hotel:${getName} Price: ${getPrice} Tax: ${getTax} Room: ${getRoom} Qualification: ${getQualification}`);
    }
    fs.writeFileSync('./booking.json', JSON.stringify(data, null, 2), 'utf8')
    await browser.close();

}


initialization();  // ejecuto 





// const puppeteer = require('puppeteer');
// let bookingUrl = 'https://www.booking.com/searchresults.es.html?label=gen173nr-1FCAEoggI46AdIM1gEaAyIAQGYAQq4ARnIAQzYAQHoAQH4AQuIAgGoAgO4AsuH6ZgGwAIB0gIkMDU1YWVhNWUtYjc1NS00YTVhLWE4NzYtNmRlNGRkMGVmODFj2AIG4AIB&lang=es&sid=6a0d65e8a01cac135af939438b57a90f&sb=1&sb_lp=1&src=index&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Findex.es.html%3Flabel%3Dgen173nr-1FCAEoggI46AdIM1gEaAyIAQGYAQq4ARnIAQzYAQHoAQH4AQuIAgGoAgO4AsuH6ZgGwAIB0gIkMDU1YWVhNWUtYjc1NS00YTVhLWE4NzYtNmRlNGRkMGVmODFj2AIG4AIB%26sid%3D6a0d65e8a01cac135af939438b57a90f%26sb_price_type%3Dtotal%26%26&ss=C%C3%B3rdoba%2C+Provincia+de+C%C3%B3rdoba%2C+Argentina&is_ski_area=&ssne=R%C3%ADo+de+Janeiro&ssne_untouched=R%C3%ADo+de+Janeiro&checkin_year=2022&checkin_month=9&checkin_monthday=18&checkout_year=2022&checkout_month=9&checkout_monthday=19&group_adults=2&group_children=0&no_rooms=1&b_h4u_keep_filters=&from_sf=1&search_pageview_id=a06d89a6aa4c0094&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0&ac_position=2&ac_langcode=es&ac_click_type=b&dest_id=-983417&dest_type=city&iata=COR&place_id_lat=-31.416555&place_id_lon=-64.1837&search_pageview_id=a06d89a6aa4c0094&search_selected=true&ss_raw=arge';
// (async () => {
// const browser = await puppeteer.launch({ headless: true });
// const page = await browser.newPage();
// await page.setViewport({ width: 1920, height: 926 });
// await page.goto(bookingUrl);
// // get hotel details
// let hotelData = await page.evaluate(() => {
// let hotels = [];
// // get the hotel elements
// let hotelsElms = document.querySelectorAll('div.sr_property_block[data-hotelid]');
// // get the hotel data
// hotelsElms.forEach((hotelelement) => {
// let hotelJson = {};
// try {
// hotelJson.name = hotelelement.querySelector('span.sr-hotel__name').innerText;
// hotelJson.reviews = hotelelement.querySelector('span.review-score-widget__subtext').innerText;
// hotelJson.rating = hotelelement.querySelector('span.review-score-badge').innerText;
// if(hotelelement.querySelector('strong.price')){
// hotelJson.price = hotelelement.querySelector('strong.price').innerText;
// }
// }
// catch (exception){
// }
// hotels.push(hotelJson);
// });
// return hotels;
// });
// console.dir(hotelData);
// })();