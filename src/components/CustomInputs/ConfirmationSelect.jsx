import React, {useState} from 'react';
import { Box, Radio, FormControlLabel, RadioGroup, styled } from '@mui/material';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2)
}));

const RadioOption = styled(Box)(({ selected }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: selected ? '#2A2A2A' : '#1A1A1A',
    color: selected ? '#FFFFFF' : '#A0A0A1',
  
    '&:hover': {
      backgroundColor: '#2A2A2A',
    },
  }));
  
  const StyledRadio = styled(Radio)(({ theme }) => ({
    marginRight: '8px',
    color: 'inherit', // Inherit color from RadioOption
    '&.Mui-checked': {
      color: '#616FE8', // Set the checked color
    },
  }));


const ConfirmationSelect = ({ value, onChange, onSubmit }) => {
    const [selectedType, setSelectedType] = useState('');

    const handleChange = (type) => {
    setSelectedType(type);
    onChange(type.toLowerCase());
    onSubmit(type.toLowerCase());
  };

  const confirmationTypes = [
    'Yes',
    'No',
  ]

  return (
    <Container>
      {confirmationTypes.map((type) => (
        <RadioOption
          key={type}
          selected={type === selectedType}
          onClick={() => handleChange(type)}
        >
          <StyledRadio checked={type === selectedType} />
          {type}
        </RadioOption>
      ))}
    </Container>
  );
};

export default ConfirmationSelect;