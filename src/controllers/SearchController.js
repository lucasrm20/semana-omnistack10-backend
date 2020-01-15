const Dev   = require('../models/Dev');

const parseStringAsArray = require('../utils/parseStringAsArray');

const index = async (req, res) => {
  const filters = {
    ...req.query,
    techs: parseStringAsArray(req.query.techs)
  };

  const devs = await Dev.find({
    techs: {
      $in: filters.techs
    },
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [filters.longitude, filters.latitude]
        },
        $maxDistance: 10000
      }
    }
  });
  
  return res.json(devs);
};

module.exports = {
  index
};
