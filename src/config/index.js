import env from 'react-native-config';

const config = {
  resizeEndpoint: {
    key: env.RESIZE_ENDPOINT,
  },
  google: {
    geoKey: env.GEO_KEY,
  },
};

export default config;
