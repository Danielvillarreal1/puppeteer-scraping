const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');
//var mysql = require('mysql');
var mysql = require("mysql2");
const internal = require('stream');

  (async () => {

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const header = randomUseragent.getRandom();
    await page.setUserAgent(header);  // usa el useragen

    const connection = mysql.createConnection({
      host: '172.19.0.2',
      user: 'root',
      password: 'root',
      database: 'booki'
    });

    connection.connect(function(err) {
          if (err) {
            return console.error('error: ' + err.message);
          }
        
          console.log('Connected to the MySQL server.');
        });

        var sql = "CREATE TABLE if not exists hotel(ID int AUTO_INCREMENT, Name_hotel varchar(100), Prices varchar(50), Taxs varchar(100), Rooms varchar(100), Qualifications varchar(100), PRIMARY KEY(ID) )";

      connection.query(sql, function (err, rows) {
          if (err) throw err;
          console.log("Table created");
      });
      

    

    let url = 'https://www.booking.com/searchresults.es.html?label=gen173nr-1FCAEoggI46AdIM1gEaAyIAQGYAQq4ARnIAQzYAQHoAQH4AQuIAgGoAgO4AsuH6ZgGwAIB0gIkMDU1YWVhNWUtYjc1NS00YTVhLWE4NzYtNmRlNGRkMGVmODFj2AIG4AIB&sid=6a0d65e8a01cac135af939438b57a90f&aid=304142&lang=es&sb_lp=1&src=index&error_url=https%3A%2F%2Fwww.booking.com%2Findex.es.html%3Flabel%3Dgen173nr-1FCAEoggI46AdIM1gEaAyIAQGYAQq4ARnIAQzYAQHoAQH4AQuIAgGoAgO4AsuH6ZgGwAIB0gIkMDU1YWVhNWUtYjc1NS00YTVhLWE4NzYtNmRlNGRkMGVmODFj2AIG4AIB%26sid%3D6a0d65e8a01cac135af939438b57a90f%26sb_price_type%3Dtotal%26%26&ss=Argentina&is_ski_area=&checkin_year=2022&checkin_month=11&checkin_monthday=5&checkout_year=2022&checkout_month=11&checkout_monthday=6&group_adults=2&group_children=0&no_rooms=1&b_h4u_keep_filters=&from_sf=1&ss_raw=arge&ac_position=1&ac_langcode=es&ac_click_type=b&dest_id=10&dest_type=country&place_id_lat=-36.8121&place_id_lon=-64.796&search_pageview_id=e6ae6e201b900269&search_selected=true&search_pageview_id=e6ae6e201b900269&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0&nflt=ht_id%3D204';

    await page.goto(url)
    await page.waitForSelector('.b978843432');  // espera hasta que el selector tenga la clase(1 cuadro donde esta toda la info)

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

      // busque el objeto price y debuelva en una constante getprice el texto
      const getName = await page.evaluate(name_hotel => name_hotel.innerText, name_hotel);
      const getPrice = await page.evaluate(price => price.innerText, price);
      const getTax = await page.evaluate(tax => tax.innerText, tax);
      const getRoom = await page.evaluate(room => room.innerText, room);
      const getQualification = await page.evaluate(qualification => qualification.innerText, qualification);
      //const getPunctuation = await page.evaluate(punctuation => punctuation.innerText, punctuation);
      //const getAvailability = await page.evaluate(availability => availability.innerText, availability);
      //console.log('---->', getName)
          

      const insertoHot = "INSERT INTO hotel (Name_hotel, Prices, Taxs, Rooms, Qualifications) values (?,?,?,?,?)";
      

      let rows = await new Promise((resolve,reject)=>{
        connection.query(insertoHot,[getName, getPrice, getTax, getRoom, getQualification],function(err, rows) {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log('Fila insertada');
            resolve(rows);
          }
        });
      });
  } 
    await browser.close()
    connection.end();
    
  })();




// CREATE TABLE hotel(
//     ID int AUTO_INCREMENT,
//     Name_hotel varchar(100),
//     Prices int(50),
//     Taxs int(100),
//     Rooms varchar(100),
//     Qualifications varchar(100),
//     PRIMARY KEY (ID)
// ); 
