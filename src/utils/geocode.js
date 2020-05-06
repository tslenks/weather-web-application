const request = require('request');

const geocode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoidHNsZW5rcyIsImEiOiJjazkzMzZkY3IwMTVsM25ubngzMTVlaGQ1In0.ARAyVqVyneV20pes_YODwA&limit=1`;
  request.get({ url, json: true }, (error, response) => {
    if (!response) {
      callback('Error on requesting  :: Check your connection');
    } else {
      const { body } = response;
      if (!body || (body && body.message)) {
        callback(`Error on requesting :: ${body.message ? body.message : 'Check your connection'}`);
      } else if (body.features.length === 0) {
        callback('Unable to find location, try another search');
      } else {
        const { center, place_name } = body.features[0];
        const [longitude, latitude] = center;
        callback(undefined, { place_name, latitude, longitude });
      }
    }
  });
};

module.exports = geocode;
