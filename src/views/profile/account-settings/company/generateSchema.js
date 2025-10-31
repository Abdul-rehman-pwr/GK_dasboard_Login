import { useTranslations } from 'next-intl'
import * as Yup from 'yup'

const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/
const bicRegex = /^[A-Z]{4}[A-Z]{2}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3})?$/
const vatRegex = /^[A-Z]{2}\d{8,12}$/

const useGenerateValidationSchema = () => {
  const t = useTranslations()

  return Yup.object().shape({
    companyName: Yup.string().required(`${t('companyName')} ${t('isRequired')}`),

    isThisPrimaryActivity: Yup.string()
      .oneOf(['PRIMARY_ACTIVITY', 'SECONDARY_ACTIVITY'], t('invalidSelection'))
      .required(`${t('activityType')} ${t('isRequired')}`),

    companyAccountType: Yup.string()
      .oneOf(['FREELANCE', 'TRADER'], t('invalidSelection'))
      .required(`${t('accountType')} ${t('isRequired')}`),

    state: Yup.string().required(`${t('state')} ${t('isRequired')}`),

    taxOffice: Yup.string().required(`${t('taxOffice')} ${t('isRequired')}`),

    iban: Yup.string()
      .matches(ibanRegex, t('invalidIBAN'))
      .required('IBAN ' + t('isRequired')),

    bic: Yup.string()
      .matches(bicRegex, t('invalidBIC'))
      .required('BIC ' + t('isRequired')),

    vatnumber: Yup.string()
      .matches(vatRegex, t('invalidVAT'))
      .required(`${t('vatNumber')} ${t('isRequired')}`)
  })
}

export default useGenerateValidationSchema
