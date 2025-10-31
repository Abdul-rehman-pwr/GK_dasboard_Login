import * as yup from 'yup'
import { useTranslations } from 'next-intl'

const useProfileValidations = () => {
  const t = useTranslations()

  return yup.object().shape({
    firstName: yup.string().max(50, t('max50Characters')).required(t('firstNameIsRequired')),
    lastName: yup.string().max(50, t('max50Characters')).required(t('lastNameIsRequired')),
    email: yup.string().email(t('invalidEmailFormat')).required(t('emailIsRequired')),
    // organization: yup.string().max(100, t('max100Characters')).required(t('organizationIsRequired')),
    phoneNumber: yup
      .string()
      .matches(/^[0-9+\-\s()]+$/, t('phoneNumberMustBeNumericOrContainPlusMinus'))
      .max(15, t('max15Digits'))
      .required(t('phoneNumberIsRequired')),
    address: yup.string().max(100, t('max100Characters')).required(t('addressIsRequired')),
    city: yup.string().max(50, t('max50Characters')).required(t('cityIsRequired')),
    postalCode: yup
      .string()
      .matches(/^\d+$/, t('postalCodeMustBeNumeric'))
      .max(10, t('max10Digits'))
      .required(t('postalCodeIsRequired')),
    country: yup.string().required(t('countryIsRequired')),
    language: yup.string().required(t('languageIsRequired')),
    timezone: yup.string().required(t('timezoneIsRequired')),
    currency: yup.string().required(t('currencyIsRequired'))
  })
}

export default useProfileValidations
