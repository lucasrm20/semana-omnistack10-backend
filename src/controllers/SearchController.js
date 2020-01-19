const Dev   = require('../models/Dev');

const parseStringAsArray = require('../utils/parseStringAsArray');

const index = async (req, res) => {
  const filters = {
    ...req.query,
    techs: parseStringAsArray(req.query.techs || '')
  };

  const query = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [filters.longitude, filters.latitude]
        },
        $maxDistance: 10000
      }
    }
  };

  if (filters.techs[0]) {
    query.techs = {
      $in: filters.techs
    }
  }

  const devs = await Dev.find(query);
  
  return res.json(devs);
};

module.exports = {
  index
};
