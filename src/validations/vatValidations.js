import * as yup from 'yup'
import { useTranslations } from 'next-intl'

const useVatValidations = () => {
  const t = useTranslations()

  return yup.object().shape({
    vatType: yup.string().required(t('vatType'))
  })
}

export default useVatValidations
