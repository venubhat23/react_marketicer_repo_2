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
      <Tabs value={value} onChange={handleChange} aria-label="Reusable Tabs" sx={{bgcolor:'#fff'}}>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            id={`tab-${index}`}
            aria-controls={`tabpanel-${index}`}
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
