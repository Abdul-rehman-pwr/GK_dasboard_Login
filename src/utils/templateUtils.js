export const parseTemplates = templates =>
  templates.map(template => {
    let parsedData
    try {
      parsedData = JSON.parse(template.data)
    } catch {
      parsedData = template.data
    }
    return { ...template, data: parsedData }
  })

export const getStylesForTemplate = (parsedTemplates, templateId, themeColor) => {
  const templateEntry = parsedTemplates?.find(t => t.id === templateId)

  if (templateEntry) {
    const styles = templateEntry.data
    const updatedStyles = Object.entries(styles).reduce((acc, [key, value]) => {
      acc[key] = value === 'themeColor' ? themeColor : value
      return acc
    }, {})

    return {
      ...updatedStyles,
      layout: templateEntry.name
    }
  }

  return null
}
