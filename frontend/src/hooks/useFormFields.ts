import { useState } from 'react'

const useFormFields = <T extends object>(initialValues: T) => {
  const [values, setValues] = useState(initialValues)

  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setValues((current) => ({ ...current, [field]: value }))
  }

  return { values, setValues, updateField }
}

export default useFormFields
