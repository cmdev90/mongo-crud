var mongo = require('./');

console.log(mongo);

mongo.connect('mongodb://localhost/db');

// wait 2 seconds to confirm the connection and initilize the object.
setTimeout(function () {
  mongo.create('People', {name: 'Kalidia Millette', position: 'Cow Mechanic', rank: '...'}, function (err, result){
      console.log(err, result); 
      var recent = result.insertedIds[0];
      mongo.retrieve('People', {name: 'Kalidia Millette'}, function (err, result) {
        console.log(err, result);
        mongo.update('People', {_id: recent, rank: 'Novice'} ,function (err, result){
          console.log(err, result);
          mongo.retrieve('People', {name: 'Kalidia Millette'}, function (err, result) {
            console.log(err, result);
            mongo.delete('People', function (err, result) {
              console.log(err, result);
              mongo.retrieve('People', {name: 'Kalidia Millette'}, function (err, result) {
                console.log(err, result);
              });
            })
          });
        })
      });
  });
}, 2000);
