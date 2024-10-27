const postPredictHandler = require('../server/handler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true
      }
    }
  },
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {

        return 'Hello World!';
    }
}
]

module.exports = routes;