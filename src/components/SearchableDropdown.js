import React from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
} from '@mui/material';

const SearchableDropdown = ({
  options = [],
  value,
  onChange,
  label,
  placeholder = "Type to search...",
  required = false,
  variant = "outlined",
  fullWidth = true,
  getOptionLabel = (option) => option?.name || option?.label || option,
  renderOption = null,
  filterOptions = null,
  disabled = false,
  multiple = false,
  noOptionsText = "No options",
  ...otherProps
}) => {
  const defaultRenderOption = (props, option) => (
    <Box component="li" {...props}>
      <Box>
        <Typography variant="body1">
          {getOptionLabel(option)}
        </Typography>
        {option.email && (
          <Typography variant="body2" color="text.secondary">
            {option.email}
          </Typography>
        )}
        {option.description && (
          <Typography variant="body2" color="text.secondary">
            {option.description}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const defaultFilterOptions = (options, { inputValue }) => {
    if (!inputValue) return options;
    
    const searchTerm = inputValue.toLowerCase();
    return options.filter(option => {
      const label = getOptionLabel(option).toLowerCase();
      const email = option.email?.toLowerCase() || '';
      const description = option.description?.toLowerCase() || '';
      
      return label.includes(searchTerm) || 
             email.includes(searchTerm) || 
             description.includes(searchTerm);
    });
  };

  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={onChange}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption || defaultRenderOption}
      filterOptions={filterOptions || defaultFilterOptions}
      disabled={disabled}
      multiple={multiple}
      noOptionsText={noOptionsText}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          variant={variant}
          fullWidth={fullWidth}
        />
      )}
      {...otherProps}
    />
  );
};

export default SearchableDropdown;