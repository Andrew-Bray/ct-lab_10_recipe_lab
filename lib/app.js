const express = require('express');
const app = express();
//const Log = require('./models/Log');

app.use(express.json());

app.use('/api/v1/recipes', require('./controllers/recipes'));
app.use('/api/v1/logs', require('./controllers/logs'));


app.post('/api/v1/logs', (req, res, next) => {
  Log
    .insert(req.body)
    .then(recipes => res.send(recipes))
    .catch(next);

});

// app.get('/api/v1/recipes', (req, res, next) => {
//   Recipe
//     .find()
//     .then(recipes => res.send(recipes))
//     .catch(next);
// });

// app.get('/api/v1/recipes/:id', (req, res, next) => {
//   Recipe
//     .findById(req.params.id)
//     .then(recipe => res.send(recipe))
//     .catch(next);
// });

// app.put('/api/v1/recipes/:id', (req, res, next) => {
//   Recipe
//     .update(req.params.id, req.body)
//     .then(recipe => res.send(recipe))
//     .catch(next);
// });

// app.delete('/api/v1/recipes/:id', (req, res, next) => {
//   Recipe
//     .delete(req.params.id)
//     .then(recipe => res.send(recipe))
//     .catch(next);
// });

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
