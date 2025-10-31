const responseHandler = response => {
  try {
    if (!response) {
      throw new Error('Invalid response format')
    }
    const result = response.data
    return {
      result: result.data,
      status: result.status,
      description: result.description
    }
  } catch (error) {
    console.error('Error in responseHandler:', error)
    return {
      result: null,
      status: '400',
      description: error.message || 'An error occurred while processing the response.'
    }
  }
}

export default responseHandler
