import React, { useState } from 'react';
import { Box, IconButton, Typography, styled } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

const VisitorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const CounterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const Counter = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const CountDisplay = styled(Typography)({
  width: '40px',
  textAlign: 'center',
});

const VisitorSelect = ({ onChange, onSubmit }) => {
  const [counts, setCounts] = useState({ adults: 0, kids: 0, seniors: 0 });

  const handleChange = (type, increment) => {
    const newCount = Math.max(0, counts[type] + increment);
    const newCounts = { ...counts, [type]: newCount };
    setCounts(newCounts);
    onChange(newCounts);
    onSubmit(newCounts)
  };

  return (
    <VisitorContainer>
      {[
        { key: 'adults', label: 'Adults' },
        { key: 'kids', label: 'Kids' },
        { key: 'seniors', label: 'Seniors' }
      ].map(({ key, label }) => (
        <CounterContainer key={key}>
          <Typography sx={{ width: 80 }}>{label}:</Typography>
          <Counter>
            <IconButton 
              size="small"
              onClick={() => handleChange(key, -1)}
              disabled={counts[key] === 0}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <CountDisplay>{counts[key]}</CountDisplay>
            <IconButton 
              size="small"
              onClick={() => handleChange(key, 1)}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Counter>
        </CounterContainer>
      ))}
    </VisitorContainer>
  );
};

export default VisitorSelect;