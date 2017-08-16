export default {
  '/': {
    '/stories': {
      model: 'story',
      '/:id': {},
    },
    '/contributors': {
      model: 'contributor',
      '/:id': {},
    },
    '/issues': {
      model: 'issue',
      '/:id': {},
    },
    '/photos': {
      model: 'photo',
      '/:id': {},
    },
  },
}
