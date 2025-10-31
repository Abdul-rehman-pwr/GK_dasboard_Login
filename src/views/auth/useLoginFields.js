export default function useLoginFields(t) {
  return [
    {
      name: 'email',
      label: t('emailOrUsernameLabel'),
      placeholder: t('emailOrUsernamePlaceholder'),
      type: 'text',
      autoFocus: true,
      fullWidth: true
    },
    {
      name: 'password',
      label: t('passwordLabel'),
      placeholder: t('passwordPlaceholder'),
      type: 'password',
      fullWidth: true,
      endAdornment: true
    }
  ]
}
