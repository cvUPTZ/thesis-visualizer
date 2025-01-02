
// src/hooks/useForm.ts
import { useState, useCallback } from 'react';
import { get, set } from 'lodash';

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

interface FormState<T> {
  values: T;
  errors: ValidationErrors<T>;
  isSubmitting: boolean;
  touched: Partial<Record<keyof T, boolean>>;
}

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => ValidationErrors<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) => {
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    isSubmitting: false,
    touched: {},
  });

  const setFieldValue = useCallback((
    field: keyof T | string, 
    value: any, 
    shouldValidate = true
  ) => {
    setFormState(prev => {
      const newValues = { ...prev.values };
      set(newValues, field, value);

      const newState = {
        ...prev,
        values: newValues,
        touched: { ...prev.touched, [field]: true },
      };

      if (shouldValidate && validate) {
        newState.errors = validate(newValues);
      }

      return newState;
    });
  }, [validate]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'number' ? Number(value) : value;
    setFieldValue(name, fieldValue);
  }, [setFieldValue]);

  const handleArrayChange = useCallback((
    field: keyof T, 
    index: number, 
    value: any
  ) => {
    setFormState(prev => {
      const array = Array.isArray(prev.values[field]) 
        ? [...(prev.values[field] as any[])] 
        : [];
      array[index] = value;

      const newValues = {
        ...prev.values,
        [field]: array,
      };

      return {
        ...prev,
        values: newValues,
        touched: { ...prev.touched, [field]: true },
        errors: validate ? validate(newValues) : prev.errors,
      };
    });
  }, [validate]);

  const resetForm = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      isSubmitting: false,
      touched: {},
    });
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate) {
      const errors = validate(formState.values);
      setFormState(prev => ({ ...prev, errors }));
      
      if (Object.keys(errors).length > 0) {
        return;
      }
    }

    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      await onSubmit(formState.values);
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const setFieldTouched = useCallback((
    field: keyof T,
    isTouched = true,
    shouldValidate = true
  ) => {
    setFormState(prev => {
      const newState = {
        ...prev,
        touched: { ...prev.touched, [field]: isTouched },
      };

      if (shouldValidate && validate) {
        newState.errors = validate(prev.values);
      }

      return newState;
    });
  }, [validate]);

  return {
    ...formState,
    setFieldValue,
    setFieldTouched,
    handleArrayChange,
    handleChange,
    handleSubmit,
    resetForm,
    isValid: Object.keys(formState.errors).length === 0,
  };
};