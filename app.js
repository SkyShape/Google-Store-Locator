const express = require('express');
const mongoose = require('mongoose');
const store = require('./api/models/store');
const app = express();
const port = 3000;
const Store = require('./api/models/store');

mongoose.connect('mongodb+srv://user0-1:CvGM4EoEcCQSv3Y0@cluster0.4yzl5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//
app.use((req, res, next) =>{
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.json({limit: '50mb'}));



app.post('/api/stores', (req, res) => {
  // let dbStores = require('./store-data.json');
  let dbStores =[];
  let stores = req.body;

 
  

  stores.forEach((store)=>{
    dbStores.push({
      storeName: store.name,
      phoneNumber: store.phoneNumber,
      address: store.address,
      openStatusText: store.openStatusText,
      addressLines: store.addressLines,
      location: {
        type: 'Point',
        coordinates: [
          store.coordinates.longitude,
          store.coordinates.latitude
        ]
      }
    });
  });
  
 
  Store.create(dbStores, (err, stores) =>{
    if(err){
      res.status(500).send(err);
    } else{
      res.status(200).send(stores);
    }
  });
 
});

app.get('/api/stores', (req, res) => {
  store.find({}, (err, result)=>{
    if(err){
      res.status(500).send(err);
    } else {
      res.status(200).send(result);
    }
  })
});


app.delete('/api/stores', (req, res) =>{
    Store.deleteMany({}, (err)=>{
      res.status(200).send(err);
    });
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});