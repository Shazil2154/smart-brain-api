const Clarifai = require('clarifai');
const app = new Clarifai.App({
  apiKey: 'b91e5fa7922f41d8807a800f4d819a42'
});
const handleApiCall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        // .predict('c0c0ac362b03416da06ab3fa36fb58e3', req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err=> {
            res.status(400).json('unable to connect with clarifai');
        })
}

const handleImage = (req,res,db) => {
    const { id } = req.body;
   db('users')
  .where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
      res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries ☹'));
}
module.exports = {
    handleImage,
    handleApiCall
}