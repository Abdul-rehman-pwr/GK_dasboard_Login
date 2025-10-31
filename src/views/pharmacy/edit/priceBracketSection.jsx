import { useFormContext, useFieldArray } from 'react-hook-form'
import { Grid, TextField, Card, CardHeader, CardContent } from '@mui/material'

const PriceBracketsSection = () => {
  const { control, register } = useFormContext()
  const { fields } = useFieldArray({
    control,
    name: 'priceBrackets'
  })

  return (
    <Card sx={{ minHeight: 200 }}>
      <CardHeader title='Price Brackets' />
      <CardContent>
        <Grid container spacing={2}>
          {fields.map((field, index) => (
            <Grid container spacing={2} key={field.id} sx={{ mb: 5 }}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label='Price Threshold'
                  type='number'
                  disabled
                  {...register(`priceBrackets.${index}.priceThreshold`)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label='Comparison Operator'
                  disabled
                  {...register(`priceBrackets.${index}.priceComparisonOperator`)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label='Percentage Increase'
                  type='number'
                  disabled
                  {...register(`priceBrackets.${index}.percentageIncrease`)}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PriceBracketsSection
