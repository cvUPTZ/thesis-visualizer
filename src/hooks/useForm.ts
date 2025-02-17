// import { useState, useCallback } from 'react';

// interface FormState<T> {
//   values: T;
//   errors: Partial<Record<keyof T, string>>;
//   isSubmitting: boolean;
// }

// interface UseFormOptions<T> {
//   initialValues: T;
//   validate?: (values: T) => Partial<Record<keyof T, string>>;
//   onSubmit: (values: T) => Promise<void> | void
// }

// export const useForm = <T extends Record<string, any>>({
//   initialValues,
//   validate,
//   onSubmit,
// }: UseFormOptions<T>) => {
//   const [formState, setFormState] = useState<FormState<T>>({
//     values: initialValues,
//     errors: {},
//     isSubmitting: false,
//   });

//    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//         setFormState(prev => ({
//          ...prev,
//         values: {
//             ...prev.values,
//             [name]: value
//           },
//           errors: {
//             ...prev.errors,
//               [name]: undefined
//             }
//         }));
//       }, []);


//     const setFieldValue = useCallback((field: keyof T, value: any) => {
//      setFormState(prev => ({
//         ...prev,
//           values: {
//             ...prev.values,
//             [field]: value
//           },
//         errors: {
//             ...prev.errors,
//               [field]: undefined
//             }
//      }))
//     }, []);

//     const handleArrayChange = useCallback((field: keyof T, index: number, value: any) => {
//       setFormState(prev => {
//            const values = Array.isArray(prev.values[field]) ? [...(prev.values[field] as any[])] : []
//           values[index] = value;
//            return {
//                 ...prev,
//                 values: {
//                     ...prev.values,
//                     [field]: values
//                  },
//                  errors: {
//                     ...prev.errors,
//                       [field]: undefined
//                    }
//                }
//        })
//     }, []);


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validate) {
//          const errors = validate(formState.values);
//         setFormState(prev => ({
//            ...prev,
//             errors: errors
//          }))
//         if (Object.keys(errors).length > 0) return;
//     }

//     setFormState(prev => ({
//         ...prev,
//          isSubmitting: true,
//         }))

//     try {
//       await onSubmit(formState.values);
//     } finally {
//         setFormState(prev => ({
//          ...prev,
//          isSubmitting: false,
//         }))
//     }
//   };

//   return {
//     ...formState,
//      setFieldValue,
//     handleArrayChange,
//     handleChange,
//     handleSubmit,
//   };
// };



import { useState } from 'react';

export const useForm = <T extends Record<string, any>>(config: {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void> | void;
}) => {
  const [values, setValues] = useState<T>(config.initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof T, value: string) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: keyof T, index: number, value: string) => {
    setValues(prev => {
      const arr = [...(prev[field] as string[])];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (config.validate) {
        const validationErrors = config.validate(values);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;
      }
      await config.onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleArrayChange,
    handleSubmit
  };
};