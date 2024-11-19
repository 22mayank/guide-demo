import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { ListItemText, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/system";

const activities = [
  "Thrill",
  "Adventure",
  "Character Experience",
  "Night Time Entertainment",
  "Special Experience",
  "Seasonal Events",
  "Special Occasions",
];

// Styled Autocomplete for consistent wrapping
const StyledAutocomplete = styled(Autocomplete)({
  "& .MuiAutocomplete-inputRoot": {
    flexWrap: "wrap",
  },
});

// Custom Chip styles with updated colors
const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "#616FE8", // Primary blue background color
  color: "#FFFFFF", // White text color
  borderRadius: "16px",
  fontWeight: "bold",
  padding: "0 8px",
  "& .MuiChip-icon": {
    color: "#FFFFFF", // White icon color
    marginLeft: "-4px", // Align tick icon closer to the text
  },
}));

const ActivitySelect = ({ value = [], onChange, onSubmit }) => {
  const [selectedActivities, setSelectedActivities] = useState([]);

  const handleChange = (event, value) => {
    onChange(value);
    onSubmit?.(value.length > 0);
    setSelectedActivities(value);
  };

  return (
    <StyledAutocomplete
      multiple
      margin="none" // Remove all margins
      options={activities}
      disableCloseOnSelect
      value={selectedActivities}
      onChange={handleChange}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            checked={selected}
            style={{ marginRight: 8 }}
          />
          <ListItemText primary={option} />
        </li>
      )}
      renderTags={(selected, getTagProps) =>
        selected.map((option, index) => (
          <StyledChip
            {...getTagProps({ index })}
            key={option}
            icon={<CheckCircleIcon />}
            label={option}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder={selectedActivities ? "" : "Select all the activities"}
          style={{ width: "450px" }} // Fixed width
        />
      )}
    />
  );
};

export default ActivitySelect;
