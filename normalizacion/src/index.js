import { normalize, schema, denormalize } from 'normalizr';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputPath = path.join(__dirname, '../data/input.json');

import express, { text } from 'express';

const app = express();

//ORIGINAL//
app.get('/original', (req, res) => {
  const originalData = JSON.parse(fs.readFileSync(inputPath));

  res.json({
    originalData,
  });
});

const autores = new schema.Entity(
    'autores', {}, { 
      idAttribute: 'id',
    },
);


const autor = new schema.Entity(
    'autor', { 
      author: autores,
    },
);

const finalSchema = [ autor ];

//NORMALIZADO//
app.get('/normalizar', (req, res) => {

    const originalData = JSON.parse(fs.readFileSync(inputPath));
  
    const normalizedData = normalize(originalData, finalSchema);
  
    const normalizedDataPath = path.join(__dirname, '../data/normalize.json');
    let contenido = JSON.stringify(normalizedData, null, '\t');
  
    fs.writeFileSync(normalizedDataPath, contenido);
    res.json({
      normalizedData,
    })
});

//DESNORMALIZADO//
app.get('/desnormalizar', (req, res) => {
  const normalizedDataPath = path.join(__dirname, '../data/normalize.json');
  const normalizedData = JSON.parse(fs.readFileSync(normalizedDataPath));
  
  const denormalizedData = denormalize( normalizedData.result, finalSchema, normalizedData.entities);

  res.json({
    denormalizedData
  })
})


app.listen(8080, () => console.log('Server ok, port: 8080'));