const axios = require('axios');
const Dev   = require('../models/Dev');

const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

const GITHUB_API = 'https://api.github.com';

const index = async (req, res) => {
  const devs = await Dev.find();

  return res.json(devs);
};

const store = async (req, res) => {
  const { 
    github_username, 
    latitude,
    longitude,
    techs = '',
  } = req.body;

  const techsArr = parseStringAsArray(techs);
  const location = {
    type: 'Point',
    coordinates: [longitude, latitude]
  };

  let dev = await Dev.findOne({ github_username });
  
  if (!dev) {
    const githubRes = await axios.get(`${GITHUB_API}/users/${github_username}`);
    const { name = login, avatar_url, bio } = githubRes.data;
  
    dev = await Dev.create({ 
      name, 
      avatar_url, 
      bio, 
      github_username,
      techs: techsArr,
      location
    });

    const sendSocketMessateTo = findConnections({latitude, longitude}, techsArr);
    sendMessage(sendSocketMessateTo, 'new-dev', dev);
  }

  return res.json(dev);
}

module.exports = {
  index,
  store
};
