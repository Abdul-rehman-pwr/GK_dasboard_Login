export const castValue = (value, type) => {
  if (type === 'number') return Number(value)
  if (type === 'boolean') return value === 'true'
  return value
}
export const formatField = (key, value, field) => {
  if (field?.type === 'date-range' && Array.isArray(value)) {
    const [start, end] = value
    const operators = field?.searchOperator || []
    return [
      start && {
        fieldName: key,
        fieldValue: castValue(start, 'number'),
        searchOperator: operators[0] || 'GREATER_THAN_OR_EQUAL'
      },
      end && {
        fieldName: key,
        fieldValue: castValue(end, 'number'),
        searchOperator: operators[1] || 'LESS_THAN_OR_EQUAL'
      }
    ].filter(Boolean)
  }

  return [
    {
      fieldName: key,
      fieldValue: castValue(value, field?.type),
      searchOperator: field?.searchOperator
    }
  ]
}
