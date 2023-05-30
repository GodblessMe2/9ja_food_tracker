const fs = require('fs');
let data = JSON.parse(fs.readFileSync(`${__dirname}/food.json`));
// console.log(data.foods);

let uniqueData = [];

data.foods.map(obj => {
  // Check if the object already exists in uniqueData
  if (!isDuplicate(obj, uniqueData)) {
    uniqueData.push(obj);
  }
});

function isDuplicate(obj, uniqueData) {
  return uniqueData.some(function(item) {
    // Compare the properties of the objects
    return (
      item.name === obj.name
    );
  });
}


const trimmedJsonData = JSON.stringify(uniqueData);
fs.writeFileSync(`${__dirname}/foodnew.json`, trimmedJsonData);
console.log('File successfully Written')
// console.log(trimmedJsonData);

