import * as yup from 'yup'

export const getClientValidationSchema = t => {
  return yup.object().shape({
    firstName: yup.string().required(t('firstNameRequred')),
    lastName: yup.string().required(t('lastNameRequred')),
    email: yup.string().email(t('invalidEmailFormat')).required(t('emailRequired')),
    city: yup.string(),
    phoneNumber: yup.string(),
    password: yup
      .string()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, t('passwordValidation'))
      .required(t('passwordIsRequired'))
  })
}
