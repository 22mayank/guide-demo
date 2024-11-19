import React, { useState } from "react";
import { Box, styled } from "@mui/material";
import { Add as AddIcon, Check as CheckIcon } from "@mui/icons-material";

const InterestContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
});

const InterestChip = styled(Box)(({ theme, selected }) => ({
  padding: "6px 16px",
  borderRadius: "20px",
  fontSize: "14px",
  cursor: "pointer",
  backgroundColor: selected ? theme.palette.primary.main : "transparent",
  color: theme.palette.common.white,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  border: `1px solid ${
    selected ? theme.palette.primary.main : theme.palette.grey[700]
  }`,
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: selected
      ? theme.palette.primary.dark
      : theme.palette.grey[800],
  },
}));

const AddCustomInterest = styled(Box)(({ theme }) => ({
  position: "relative",
  "& input": {
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    backgroundColor: "transparent",
    color: theme.palette.common.white,
    border: `1px solid ${theme.palette.grey[700]}`,
    outline: "none",
    "&:focus": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const InterestSelect = ({ value = [], onChange, onSubmit }) => {
  const [selectedInterests, setSelectedInterests] = useState(value);
  const [customInterest, setCustomInterest] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const interests = [
    "Playing",
    "Relaxing",
    "Exploring",
    "Learning",
    // "Add yours",
  ];

  const handleToggle = (interest) => {
    setCustomInterest("");
    if (interest === "Add yours") {
      setIsAddingCustom(true);
      return;
    }
    const newSelected = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];

    setSelectedInterests(newSelected);
    onChange(newSelected);
    onSubmit?.(newSelected.length > 0);
  };

  const handleCustomInterestSubmit = (e) => {
    e.preventDefault();
    if (customInterest.trim()) {
      const newSelected = [...selectedInterests, customInterest.trim()];
      setSelectedInterests(newSelected);
      onChange(newSelected);
      setIsAddingCustom(false);
    }
  };

  return (
    <InterestContainer>
      {interests.map((interest) => (
        <InterestChip
          key={interest}
          selected={selectedInterests.includes(interest)}
          onClick={() => handleToggle(interest)}
        >
          {!selectedInterests.includes(interest) && (
            <AddIcon fontSize="small" />
          )}
          {selectedInterests.includes(interest) && (
            <CheckIcon fontSize="small" />
          )}
          {interest}
        </InterestChip>
      ))}

      {isAddingCustom ? (
        <AddCustomInterest>
          <form onSubmit={handleCustomInterestSubmit}>
            <input
              autoFocus
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              placeholder="Type your interest"
              onBlur={() => !customInterest && setIsAddingCustom(false)}
            />
          </form>
        </AddCustomInterest>
      ) : (
        <InterestChip
          selected={selectedInterests.includes(customInterest)}
          onClick={() => handleToggle("Add yours")}
        >
          {/* <AddIcon fontSize="small" /> */}
          {!selectedInterests.includes(customInterest) && (
            <AddIcon fontSize="small" />
          )}
          {selectedInterests.includes(customInterest) && (
            <CheckIcon fontSize="small" />
          )}
          {customInterest ? customInterest : "Add yours"}
        </InterestChip>
      )}
    </InterestContainer>
  );
};

export default InterestSelect;
