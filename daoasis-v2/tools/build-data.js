// Writes journeys/journeys-data.js from journeys/journeys.json so pages can load the data without fetch().
const fs=require('fs'),path=require('path');
const src=path.join(__dirname,'../journeys/journeys.json');
const d=JSON.parse(fs.readFileSync(src,'utf8'));
fs.writeFileSync(path.join(__dirname,'../journeys/journeys-data.js'),'/* GENERATED from journeys.json by tools/build-data.js — edit the JSON, not this file. */\nwindow.DAO_JOURNEYS = '+JSON.stringify(d)+';\n');
console.log('journeys-data.js written:',d.journeys.length,'journeys');
