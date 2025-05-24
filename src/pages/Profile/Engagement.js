import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Paper,
} from "@mui/material";
import React from "react";

 const Engagement = () => {
  const [timeRange, setTimeRange] = React.useState("last7days");

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  // Days of the week for the chart
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    
      <Card
      sx={{
        width: "100%",
        borderRadius: "20px",
        border: "1px solid #d6d6d6",
        boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)",
        position: "relative",
        bgcolor: "#fffdfd",
      }}
     
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "1.25rem",
              color: "#333333",
              lineHeight: "18px",
            }}
          >
            Engagement Over Time
          </Typography>

          <FormControl
            size="small"
            sx={{
              width: 156,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                bgcolor: "#fafafa",
                border: "1px solid #d5d6da",
                boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
              },
            }}
          >
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              displayEmpty
              IconComponent={KeyboardArrowDownIcon}
              sx={{
                color: "#6C737F",
                "& .MuiSelect-select": {
                  py: 1.25,
                  px: 1.75,
                },
              }}
            >
              <MenuItem value="last7days">Last 7 days</MenuItem>
              <MenuItem value="last30days">Last 30 days</MenuItem>
              <MenuItem value="last90days">Last 90 days</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 2, height: 218 }}>
          <Box sx={{ position: "relative", height: "100%" }}>
            {/* Grid lines */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <Box
                    key={`divider-${index}`}
                    sx={{
                      width: "100%",
                      height: "1px",
                      backgroundImage:
                        "url(https://c.animaapp.com/mavezxjciUNcPR/img/divider.svg)",
                      backgroundRepeat: "repeat-x",
                    }}
                  />
                ))}
            </Box>

            {/* Chart data */}
            <Box
              component="img"
              src="https://c.animaapp.com/mavezxjciUNcPR/img/-chart-data.svg"
              alt="Chart showing engagement data"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "192px",
              }}
            />

            {/* Days of week labels */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                px: 2,
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
              }}
            >
              {daysOfWeek.map((day, index) => (
                <Typography
                  key={`day-${index}`}
                  variant="caption"
                  sx={{
                    color: "#6C737F",
                    fontSize: "0.75rem",
                  }}
                >
                  {day}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
    
    
  );
};

export default Engagement