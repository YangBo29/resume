/**
 * Created by yangbo on 2017/12/6.
 */
let fs = require('fs');
let ary = fs.readdirSync('./');
let result = [];
ary.forEach(function(item){
   if(/\.(PNG|GIF|JPG)/i.test(item)){
       result.push(`img/`+item);
   }
});
fs.writeFileSync('./result.txt',JSON.stringify(result),'utf-8');