export default {
  '/': {
    '/photos': {
      model: 'photo',
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
