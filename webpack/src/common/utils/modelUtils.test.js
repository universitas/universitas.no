import { cleanFields, detailFieldFilter, listFieldFilter } from './modelUtils'

test('clean and default field values', () => {
  expect(cleanFields({ key: 'foo_bar' })).toEqual({
    key: 'foo_bar',
    label: 'foo bar',
    type: 'string',
    editable: false,
  })
})

test('filter detail and field types', () => {
  let fields = [
    { key: 'both', list: true },
    { key: 'list_only', list: true, detail: false },
    { key: 'detail_only', list: false },
    { key: 'none', list: false, detail: false },
  ]
  expect(R.pluck('key', detailFieldFilter(fields))).toEqual([
    'both',
    'detail_only',
  ])
  expect(R.pluck('key', listFieldFilter(fields))).toEqual(['both', 'list_only'])
  fields = R.map(cleanFields, fields)
  expect(R.pluck('key', detailFieldFilter(fields))).toEqual([
    'both',
    'detail_only',
  ])
  expect(R.pluck('key', listFieldFilter(fields))).toEqual(['both', 'list_only'])
})
