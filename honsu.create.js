var fs = require('fs');

fs.readFile('./honsu.txt', (err, data) => {
  if (err) throw err;
  var list = [];
  var lines = data.toString().split('\n');
  var rank = 1;
  for(var i=0; i<lines.length;i++)
  {
      list.push({id:i,title:lines[i],category:''})
  }
  
  fs.writeFile('./honsu.js', JSON.stringify(list), (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
    });

});