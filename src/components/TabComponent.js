import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';

const TabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const TabComponent = ({ tabs, defaultIndex = 0 }) => {
  const [value, setValue] = useState(defaultIndex);

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', }}>
      <Tabs 
        value={value} 
        onChange={handleChange} 
        aria-label="Reusable Tabs" 
        sx={{
          bgcolor: '#fff',
          borderRadius: '12px',
          padding: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #f1f5f9',
          '& .MuiTabs-indicator': {
            display: 'none'
          },
          '& .MuiTabs-flexContainer': {
            gap: '4px'
          }
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            id={`tab-${index}`}
            aria-controls={`tabpanel-${index}`}
            sx={{
              minHeight: '48px',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              color: value === index ? '#fff' : '#64748b',
              backgroundColor: value === index ? '#882AFF' : 'transparent',
              '&:hover': {
                backgroundColor: value === index ? '#7C3AED' : '#f8fafc',
                transform: 'translateY(-1px)',
                boxShadow: value === index ? '0 4px 12px rgba(136, 42, 255, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
              },
              '&.Mui-selected': {
                color: '#fff',
                backgroundColor: '#882AFF',
                boxShadow: '0 4px 12px rgba(136, 42, 255, 0.3)'
              },
              mx: 0.5,
              px: 3
            }}
          />
        ))}
      </Tabs>

      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
};

export default TabComponent;
