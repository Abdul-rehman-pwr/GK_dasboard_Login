import * as yup from 'yup'

export default function useLoginValidation(t) {
  return yup.object({
    email: yup.string().required(t('email')).email(t('invalidemail')),
    password: yup.string().required(t('passwordIsRequired'))
  })
}
