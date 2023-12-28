import { ComponentStyleConfig } from '@chakra-ui/react';

const Input: ComponentStyleConfig = {
  baseStyle: {
    field: {
      fontWeight: 'bold',
    },
  },
  variants: {
    outline: {
      field: {
        borderWidth: '2px',
        fontWeight: 'bold',
        _hover: {
          borderColor: 'primary.600',
        },
        _focus: {
          borderColor: 'primary.600',
        },
      },
    },
  },
};

const Select: ComponentStyleConfig = {
  baseStyle: {
    field: {
      fontWeight: 'bold',
    },
  },
  variants: {
    outline: {
      field: {
        fontWeight: 'bold',
        _hover: {
          borderColor: 'primary.600',
        },
        _focus: {
          borderColor: 'primary.600',
        },
      },
    },
  },
};

const Textarea: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 'bold',
  },
};

export const components = {
  Input,
  Textarea,
  Select,
};
