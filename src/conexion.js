/*const { createPool } = require("mysql2/promise");

module.exports.pool = createPool({
    host:'bvt2gfad77wgbk8yucn7-mysql.services.clever-cloud.com',
    user:'ulhy8sz9lmlzakcj',
    password:'yQpVSPuK6pdvIOCKnl00',
    port:3306,
    database:'bvt2gfad77wgbk8yucn7'
})
*/

const { createPool } = require("mysql2/promise");

module.exports.pool = createPool({
    host:'localhost',
    user:'root',
    password:'admin',
    port:3306,
    database:'proyce2'
})




