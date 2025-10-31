export const metadataSection = {
  title: 'Metadata',
  gridSize: 12,
  style: { minHeight: 250 },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      validation: { required: 'Name is required' },
      gridSize: 4
    },
    {
      name: 'type',
      label: 'Type',
      type: 'text', // will override at runtime if type === 'image'
      validation: { required: 'Type is required' },
      gridSize: 4
    },
    {
      name: 'value',
      label: 'Value',
      type: 'text', // will override at runtime if type === 'image'
      validation: { required: 'Value is required' },
      gridSize: 4
    }
  ]
}
