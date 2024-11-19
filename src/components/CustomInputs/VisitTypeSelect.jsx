import React, { useState } from "react";
import { Box, Radio, styled, IconButton, Typography } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

const Container = styled(Box)({
  width: "100%",
});

const RadioContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const RadioOption = styled(Box)(({ selected }) => ({
  display: "flex",
  alignItems: "center",
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
  backgroundColor: selected ? "#2A2A2A" : "#1A1A1A",
  color: selected ? "#FFFFFF" : "#A0A0A1",

  "&:hover": {
    backgroundColor: "#2A2A2A",
  },
}));

const SelectedDisplay = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 0",
});

const EditButton = styled(IconButton)({
  padding: "4px",
  color: "#616FE8",
});

const StyledRadio = styled(Radio)(({ theme }) => ({
  marginRight: "8px",
  color: "inherit", // Inherit color from RadioOption
  "&.Mui-checked": {
    color: "#616FE8", // Set the checked color
  },
}));

const visitTypes = [
  "Family",
  "Couple",
  "Friends",
  "Solo traveller",
  "Adventure seeker",
  "Luxury traveller",
  "Budget traveller",
];

const VisitTypeSelect = ({ value = [], onChange, onSubmit }) => {
  const [selectedType, setSelectedType] = useState("");
  const [isEditing, setIsEditing] = useState(!selectedType);

  const handleSelect = (type) => {
    setSelectedType(type);
    onChange(type);
    onSubmit(!!type);
    setIsEditing(false);
  };

  if (!isEditing && value) {
    return (
      <SelectedDisplay>
        <Typography sx={{ color: "#FFFFFF" }}>{selectedType}</Typography>
        <EditButton onClick={() => setIsEditing(true)} size="small">
          <EditIcon fontSize="small" />
        </EditButton>
      </SelectedDisplay>
    );
  }

  return (
    <Container>
      <RadioContainer>
        {visitTypes.map((type) => (
          <RadioOption
            key={type}
            selected={type === selectedType}
            onClick={() => handleSelect(type)}
          >
            <StyledRadio checked={type === selectedType} />
            {type}
          </RadioOption>
        ))}
      </RadioContainer>
    </Container>
  );
};

export default VisitTypeSelect;
