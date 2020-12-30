import Clarifai from 'clarifai';
//const Clarifai = require ('clarifai');

const app = new Clarifai.App({
    apiKey: 'c2365a688dc6458a95c6434e293b8f51'
  })

export const handleApiCall = (req, res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with Clarifai API'))
}

export const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id )
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('error getting entries data'))
}

// module.exports ={
//     handleApiCall: handleApiCall,
//     handleImage: handleImage
// };
//export default handleImage;