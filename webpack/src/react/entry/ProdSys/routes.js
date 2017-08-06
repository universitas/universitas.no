export default {
  '/': {
    '/photos': {
      model: 'photo',
    },
    '/contributors': {
      model: 'contributor',
    },
    '/issues': {
      model: 'issue',
      '/:id': {},
    },
  },
}
