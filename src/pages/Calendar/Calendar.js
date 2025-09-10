import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  Avatar,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Menu
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Image as ImageIcon,
  VideoLibrary as VideoLibraryIcon,
  Publish as PublishIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  CalendarViewMonth as CalendarViewMonthIcon,
  ViewWeek as ViewWeekIcon,
  ViewDay as ViewDayIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';

// Calendar colors
const COLORS = {
  primary: '#882AFF',
  secondary: '#091A48',
  background: '#FFFFFF',
  scheduled: '#FFA726',
  published: '#66BB6A',
  draft: '#78909C',
  failed: '#EF5350'
};

// Status colors mapping
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'scheduled': return COLORS.scheduled;
    case 'published': return COLORS.published;
    case 'draft': return COLORS.draft;
    case 'failed': return COLORS.failed;
    default: return COLORS.primary;
  }
};

const Calendar = () => {
  // State management
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [calendarView, setCalendarView] = useState('month'); // month, week, day
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [selectedDatePosts, setSelectedDatePosts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);


  // Fetch scheduled posts from API
  const fetchScheduledPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://api.marketincer.com/api/v1/posts/scheduled',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.data) {
        setScheduledPosts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
      toast.error('Failed to fetch scheduled posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  // Filter posts based on current filters
  const filteredPosts = scheduledPosts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.comments?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.brand_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    
    const matchesContentType = contentTypeFilter === 'all' ||
      (contentTypeFilter === 'video' && post.s3_url?.includes('video')) ||
      (contentTypeFilter === 'photo' && post.s3_url && !post.s3_url.includes('video'));

    return matchesSearch && matchesStatus && matchesContentType;
  });

  // Get posts for a specific date
  const getPostsForDate = (date) => {
    return filteredPosts.filter(post => 
      dayjs(post.scheduled_at).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    );
  };

  // Handle date cell click
  const handleDateClick = (date) => {
    const postsForDate = getPostsForDate(date);
    setSelectedDate(date);
    setSelectedDatePosts(postsForDate);
    setOpenPostDialog(true);
  };

  // Handle post action (publish, edit, etc.)
  const handlePostAction = async (postId, action) => {
    try {
      const token = localStorage.getItem('token');
      
      if (action === 'publish') {
        await axios.post(
          `https://api.marketincer.com/api/v1/posts/${postId}/publish`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        toast.success('Post published successfully!');
        fetchScheduledPosts(); // Refresh data
      }
    } catch (error) {
      console.error(`Error ${action}ing post:`, error);
      toast.error(`Failed to ${action} post`);
    }
    setAnchorEl(null);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setContentTypeFilter('all');
    setCurrentDate(dayjs());
    setCalendarView('month');
  };

  // Navigate to specific date
  const jumpToDate = (date) => {
    setCurrentDate(dayjs(date));
  };

  // Generate calendar days for month view
  const generateMonthDays = () => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startDate = startOfMonth.startOf('week');
    const endDate = endOfMonth.endOf('week');
    
    const days = [];
    let day = startDate;
    
    while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
      days.push(day);
      day = day.add(1, 'day');
    }
    
    return days;
  };

  // Generate week days for week view
  const generateWeekDays = () => {
    const startOfWeek = currentDate.startOf('week');
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.add(i, 'day'));
    }
    
    return days;
  };


  // Render month view
  const renderMonthView = () => {
    const days = generateMonthDays();
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Week headers */}
        <Box 
          display="grid" 
          gridTemplateColumns="repeat(7, 1fr)" 
          gap={0}
          sx={{ borderBottom: '2px solid #e0e0e0', mb: 0.5 }}
        >
          {weekDays.map((day) => (
            <Box 
              key={day} 
              sx={{ 
                p: 1, 
                textAlign: 'center',
                bgcolor: '#fafafa',
                borderRight: '1px solid #e0e0e0',
                '&:last-child': { borderRight: 'none' }
              }}
            >
              <Typography variant="body2" fontWeight="500" color={COLORS.secondary}>
                {day}
              </Typography>
            </Box>
          ))}
        </Box>
        
        {/* Calendar days grid */}
        <Box 
          display="grid" 
          gridTemplateColumns="repeat(7, 1fr)" 
          gridTemplateRows="repeat(6, minmax(120px, 1fr))"
          gap={0}
          sx={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden', minHeight: '600px' }}
        >
          {days.map((day, index) => {
            const postsForDay = getPostsForDate(day);
            const isCurrentMonth = day.month() === currentDate.month();
            const isToday = day.isSame(dayjs(), 'day');
            
            return (
              <Box
                key={index}
                sx={{
                  p: 1,
                  borderRight: index % 7 !== 6 ? '1px solid #e0e0e0' : 'none',
                  borderBottom: index < days.length - 7 ? '1px solid #e0e0e0' : 'none',
                  backgroundColor: isCurrentMonth ? COLORS.background : '#fafafa',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    backgroundColor: `${COLORS.primary}08`,
                    transform: 'scale(1.02)',
                    zIndex: 1,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }
                }}
                onClick={() => handleDateClick(day)}
              >
                {/* Date number */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography
                    variant="body2"
                    fontWeight={isToday ? '700' : '500'}
                    sx={{
                      color: isToday ? COLORS.background : (isCurrentMonth ? COLORS.secondary : '#999'),
                      bgcolor: isToday ? COLORS.primary : 'transparent',
                      borderRadius: isToday ? '50%' : 0,
                      width: isToday ? 24 : 'auto',
                      height: isToday ? 24 : 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}
                  >
                    {day.format('D')}
                  </Typography>
                  
                  {/* Post count indicator */}
                  {postsForDay.length > 0 && (
                    <Box
                      sx={{
                        backgroundColor: COLORS.primary,
                        color: 'white',
                        borderRadius: '50%',
                        width: 18,
                        height: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}
                    >
                      {postsForDay.length}
                    </Box>
                  )}
                </Box>
                
                {/* Posts preview */}
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  {postsForDay.slice(0, 1).map((post, postIndex) => (
                    <Box
                      key={postIndex}
                      sx={{
                        fontSize: '9px',
                        p: 0.2,
                        mb: 0.2,
                        borderRadius: 0.3,
                        backgroundColor: getStatusColor(post.status),
                        color: 'white',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: '500'
                      }}
                    >
                      {dayjs(post.scheduled_at).format('HH:mm')} - {post.comments?.substring(0, 10)}...
                    </Box>
                  ))}
                  {postsForDay.length > 1 && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: COLORS.primary,
                        fontWeight: '600',
                        fontSize: '8px'
                      }}
                    >
                      +{postsForDay.length - 1} more
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const days = generateWeekDays();
    
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Week header */}
        <Box 
          display="grid" 
          gridTemplateColumns="repeat(7, 1fr)" 
          gap={0}
          sx={{ borderBottom: '2px solid #e0e0e0', mb: 1 }}
        >
          {days.map((day) => {
            const isToday = day.isSame(dayjs(), 'day');
            return (
              <Box 
                key={day.format('YYYY-MM-DD')} 
                sx={{ 
                  p: 1, 
                  textAlign: 'center',
                  bgcolor: isToday ? `${COLORS.primary}15` : '#fafafa',
                  borderRight: '1px solid #e0e0e0',
                  '&:last-child': { borderRight: 'none' }
                }}
              >
                <Typography variant="body2" color="gray" sx={{ fontSize: '11px' }}>
                  {day.format('ddd')}
                </Typography>
                <Typography 
                  variant="body1" 
                  fontWeight="600" 
                  color={isToday ? COLORS.primary : COLORS.secondary}
                  sx={{ mt: 0.2, fontSize: '16px' }}
                >
                  {day.format('D')}
                </Typography>
              </Box>
            );
          })}
        </Box>
        
        {/* Week days content */}
        <Box 
          display="grid" 
          gridTemplateColumns="repeat(7, 1fr)" 
          gap={0}
          sx={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}
        >
          {days.map((day, index) => {
            const postsForDay = getPostsForDate(day);
            const isToday = day.isSame(dayjs(), 'day');
            
            return (
              <Box
                key={index}
                sx={{
                  p: 1,
                  borderRight: index !== 6 ? '1px solid #e0e0e0' : 'none',
                  backgroundColor: isToday ? `${COLORS.primary}05` : COLORS.background,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    backgroundColor: `${COLORS.primary}10`
                  }
                }}
                onClick={() => handleDateClick(day)}
              >
                <Box sx={{ flex: 1, overflowY: 'auto' }}>
                  {postsForDay.map((post, postIndex) => (
                    <Card key={postIndex} sx={{ mb: 1, boxShadow: 1 }}>
                      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                        <Typography variant="caption" color={COLORS.primary} fontWeight="600">
                          {dayjs(post.scheduled_at).format('HH:mm')}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '12px', mt: 0.5 }}>
                          {post.comments?.substring(0, 40)}...
                        </Typography>
                        <Chip
                          label={post.status}
                          size="small"
                          sx={{
                            mt: 0.5,
                            backgroundColor: getStatusColor(post.status),
                            color: 'white',
                            fontSize: '9px',
                            height: '18px'
                          }}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  // Render day view
  const renderDayView = () => {
    const postsForDay = getPostsForDate(currentDate);
    
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2, p: 2, bgcolor: COLORS.background, borderRadius: 1, border: '1px solid #e0e0e0' }}>
          <Typography variant="h5" fontWeight="500" color={COLORS.secondary} textAlign="center">
            {currentDate.format('dddd, MMMM D, YYYY')}
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {postsForDay.length === 0 ? (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              height="100%"
              sx={{ bgcolor: COLORS.background, borderRadius: 1, border: '1px solid #e0e0e0' }}
            >
              <EventIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="gray">
                No posts scheduled for this day
              </Typography>
              <Typography variant="body2" color="gray" sx={{ mt: 1 }}>
                Click on a date to view or schedule posts
              </Typography>
            </Box>
          ) : (
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(400px, 1fr))" gap={2}>
              {postsForDay.map((post, index) => (
                <Card key={index} sx={{ boxShadow: 2, height: 'fit-content' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="h6" fontWeight="600" color={COLORS.primary}>
                          {dayjs(post.scheduled_at).format('HH:mm')}
                        </Typography>
                        <Typography variant="body2" color="gray">
                          {post.brand_name}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={1} alignItems="center">
                        <Chip
                          label={post.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(post.status),
                            color: 'white',
                            fontWeight: '600'
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setSelectedPost(post);
                            setAnchorEl(e.currentTarget);
                          }}
                          sx={{ color: COLORS.primary }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    {post.s3_url && (
                      <Box mb={2}>
                        <Box
                          component="img"
                          src={post.s3_url}
                          alt="Post media"
                          sx={{ 
                            width: '100%', 
                            height: 200,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #e0e0e0'
                          }}
                        />
                      </Box>
                    )}
                    
                    <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.6 }}>
                      {post.comments}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', bgcolor: '#f8f9fa', overflow: 'hidden', display: 'flex' }}>
      <Box sx={{ width: '115px', flexShrink: 0 }}>
        <Sidebar />
      </Box>
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            display: { xs: 'none', md: 'block' },
            p: 1,
            backgroundColor: '#091a48',
            borderBottom: '1px solid',
            borderColor: 'divider',
            borderRadius: 0,
            flexShrink: 0
          }}
        >
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box display="flex" alignItems="center" gap={3}>
              <Typography variant="h6" sx={{ color: '#fff' }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="back"
                  sx={{ mr: 2, color: '#fff' }}
                >
                  <ArrowBackIcon />
                </IconButton>
                Calendar
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton 
                  onClick={() => setCurrentDate(currentDate.subtract(1, calendarView === 'day' ? 'day' : calendarView))}
                  sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <Button
                  onClick={() => setCurrentDate(dayjs())}
                  variant="contained"
                  size="small"
                  sx={{ 
                    minWidth: '80px',
                    bgcolor: '#fff',
                    color: '#091a48',
                    border: '1px solid #fff',
                    '&:hover': { bgcolor: '#f5f5f5', borderColor: '#f5f5f5' }
                  }}
                >
                  Today
                </Button>
                <IconButton 
                  onClick={() => setCurrentDate(currentDate.add(1, calendarView === 'day' ? 'day' : calendarView))}
                  sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  <ChevronRightIcon />
                </IconButton>
                <Typography variant="h6" fontWeight="400" color="#fff" sx={{ ml: 2 }}>
                  {currentDate.format('MMMM YYYY')}
                </Typography>
              </Box>
            </Box>
            
            <Box display="flex" alignItems="center" gap={2}>
              <Box display="flex" gap={1}>
                <IconButton size="large" sx={{ color: '#fff' }}>
                  <NotificationsIcon />
                </IconButton>
                <IconButton size="large" sx={{ color: '#fff' }}>
                  <AccountCircleIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Quick Filters Bar */}
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: 1,
            backgroundColor: COLORS.background,
            borderBottom: '1px solid #e0e0e0',
            flexShrink: 0
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1.5}>
              <TextField
                size="small"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ 
                  width: 220,
                  '& .MuiInputBase-root': { 
                    height: '36px',
                    bgcolor: '#fff',
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                      borderWidth: '1px'
                    },
                    '&:hover fieldset': {
                      borderColor: COLORS.primary,
                      borderWidth: '1px'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: COLORS.primary,
                      borderWidth: '2px',
                      boxShadow: `0 0 0 3px ${COLORS.primary}20`
                    }
                  },
                  '& .MuiInputBase-input': {
                    padding: '8px 12px',
                    fontSize: '14px'
                  }
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 0.5, color: '#666', fontSize: '18px' }} />
                }}
              />
              
              <FormControl size="small" sx={{ minWidth: 110 }}>
                <InputLabel sx={{ fontSize: '14px', color: '#666' }}>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ 
                    height: '36px', 
                    fontSize: '14px',
                    bgcolor: '#fff',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0',
                      borderWidth: '1px'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                      borderWidth: '1px'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                      borderWidth: '2px',
                      boxShadow: `0 0 0 3px ${COLORS.primary}20`
                    },
                    '& .MuiSelect-select': {
                      padding: '8px 12px'
                    }
                  }}
                >
                  <MenuItem value="all" sx={{ fontSize: '14px' }}>All Status</MenuItem>
                  <MenuItem value="scheduled" sx={{ fontSize: '14px' }}>Scheduled</MenuItem>
                  <MenuItem value="published" sx={{ fontSize: '14px' }}>Published</MenuItem>
                  <MenuItem value="draft" sx={{ fontSize: '14px' }}>Draft</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ fontSize: '14px', color: '#666' }}>Content Type</InputLabel>
                <Select
                  value={contentTypeFilter}
                  label="Content Type"
                  onChange={(e) => setContentTypeFilter(e.target.value)}
                  sx={{ 
                    height: '36px', 
                    fontSize: '14px',
                    bgcolor: '#fff',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0',
                      borderWidth: '1px'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                      borderWidth: '1px'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: COLORS.primary,
                      borderWidth: '2px',
                      boxShadow: `0 0 0 3px ${COLORS.primary}20`
                    },
                    '& .MuiSelect-select': {
                      padding: '8px 12px'
                    }
                  }}
                >
                  <MenuItem value="all" sx={{ fontSize: '14px' }}>All Types</MenuItem>
                  <MenuItem value="photo" sx={{ fontSize: '14px' }}>Photo</MenuItem>
                  <MenuItem value="video" sx={{ fontSize: '14px' }}>Video</MenuItem>
                </Select>
              </FormControl>
              
              {/* View Toggle */}
              <Box display="flex" sx={{ bgcolor: '#f5f5f5', borderRadius: 1, p: 0.3, border: '1px solid #e0e0e0' }}>
                <Button
                  size="small"
                  onClick={() => setCalendarView('month')}
                  startIcon={<CalendarViewMonthIcon sx={{ fontSize: '16px' }} />}
                  sx={{ 
                    minWidth: '70px',
                    height: '30px',
                    color: calendarView === 'month' ? '#fff' : COLORS.secondary,
                    bgcolor: calendarView === 'month' ? COLORS.primary : 'transparent',
                    '&:hover': { bgcolor: calendarView === 'month' ? COLORS.primary : 'rgba(136, 42, 255, 0.1)' },
                    fontSize: '11px',
                    px: 1
                  }}
                >
                  Month
                </Button>
                <Button
                  size="small"
                  onClick={() => setCalendarView('week')}
                  startIcon={<ViewWeekIcon sx={{ fontSize: '16px' }} />}
                  sx={{ 
                    minWidth: '70px',
                    height: '30px',
                    color: calendarView === 'week' ? '#fff' : COLORS.secondary,
                    bgcolor: calendarView === 'week' ? COLORS.primary : 'transparent',
                    '&:hover': { bgcolor: calendarView === 'week' ? COLORS.primary : 'rgba(136, 42, 255, 0.1)' },
                    fontSize: '11px',
                    px: 1
                  }}
                >
                  Week
                </Button>
                <Button
                  size="small"
                  onClick={() => setCalendarView('day')}
                  startIcon={<ViewDayIcon sx={{ fontSize: '16px' }} />}
                  sx={{ 
                    minWidth: '70px',
                    height: '30px',
                    color: calendarView === 'day' ? '#fff' : COLORS.secondary,
                    bgcolor: calendarView === 'day' ? COLORS.primary : 'transparent',
                    '&:hover': { bgcolor: calendarView === 'day' ? COLORS.primary : 'rgba(136, 42, 255, 0.1)' },
                    fontSize: '11px',
                    px: 1
                  }}
                >
                  Day
                </Button>
              </Box>
            </Box>
            
            <Button
              variant="text"
              startIcon={<ClearIcon sx={{ fontSize: '16px' }} />}
              onClick={resetFilters}
              size="small"
              sx={{ color: COLORS.primary, fontSize: '12px', height: '32px' }}
            >
              Clear Filters
            </Button>
          </Box>
        </Paper>

        {/* Main Calendar Content */}
        <Box sx={{ flex: 1, overflow: 'hidden', px: 3, pt: 1, pb: 3, height: 'calc(100vh - 180px)' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress sx={{ color: COLORS.primary }} />
            </Box>
          ) : (
            <>
              {calendarView === 'month' && renderMonthView()}
              {calendarView === 'week' && renderWeekView()}
              {calendarView === 'day' && renderDayView()}
            </>
          )}
        </Box>
      </Box>

      {/* Post Details Dialog */}
      <Dialog
        open={openPostDialog}
        onClose={() => setOpenPostDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Posts for {selectedDate?.format('MMMM D, YYYY')}
        </DialogTitle>
        <DialogContent>
          {selectedDatePosts.length === 0 ? (
            <Typography variant="body1" color="gray" textAlign="center" py={3}>
              No posts scheduled for this date
            </Typography>
          ) : (
            <List>
              {selectedDatePosts.map((post, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      {post.s3_url ? (
                        post.s3_url.includes('video') ? (
                          <VideoLibraryIcon sx={{ color: COLORS.primary }} />
                        ) : (
                          <ImageIcon sx={{ color: COLORS.primary }} />
                        )
                      ) : (
                        <EventIcon sx={{ color: COLORS.primary }} />
                      )}
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2">
                            {dayjs(post.scheduled_at).format('HH:mm')} - {post.brand_name}
                          </Typography>
                          <Box display="flex" gap={1}>
                            <Chip
                              label={post.status}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(post.status),
                                color: 'white'
                              }}
                            />
                            {post.status === 'scheduled' && (
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<PublishIcon />}
                                onClick={() => handlePostAction(post.id, 'publish')}
                                sx={{
                                  backgroundColor: COLORS.primary,
                                  '&:hover': {
                                    backgroundColor: `${COLORS.primary}dd`
                                  }
                                }}
                              >
                                Publish Now
                              </Button>
                            )}
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {post.comments}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < selectedDatePosts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPostDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Post Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {selectedPost?.status === 'scheduled' && (
          <MenuItem onClick={() => handlePostAction(selectedPost.id, 'publish')}>
            <PublishIcon sx={{ mr: 1 }} />
            Publish Now
          </MenuItem>
        )}
        <MenuItem onClick={() => setAnchorEl(null)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Post
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Calendar;