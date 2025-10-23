'use client';

import { useState, useCallback } from 'react';

export function usePhoneMask(initialValue: string = '') {
  const [value, setValue] = useState(initialValue);

  const formatPhone = useCallback((input: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = input.replace(/\D/g, '');

    // Aplica a máscara baseada no tamanho
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      // Para números com 11 dígitos (celular com 9)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  }, []);

  const handleChange = useCallback(
    (inputValue: string) => {
      const formatted = formatPhone(inputValue);
      setValue(formatted);
      return formatted;
    },
    [formatPhone]
  );

  const getUnmaskedValue = useCallback(() => {
    return value.replace(/\D/g, '');
  }, [value]);

  return {
    value,
    handleChange,
    getUnmaskedValue,
    setValue: (newValue: string) => setValue(formatPhone(newValue)),
  };
}
