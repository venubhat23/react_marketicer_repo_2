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
  AppBar,
  Toolbar,
  CircularProgress,
  Menu
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  CalendarToday as CalendarIcon,
  ViewModule as ViewModuleIcon,
  ViewWeek as ViewWeekIcon,
  ViewDay as ViewDayIcon,
  Event as EventIcon,
  ArrowBack as ArrowBackIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Image as ImageIcon,
  VideoLibrary as VideoLibraryIcon,
  Schedule as ScheduleIcon,
  Publish as PublishIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon
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

  // Filter menu state
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);

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

  // Render calendar header
  const renderCalendarHeader = () => (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="h4" fontWeight="600" color={COLORS.secondary}>
          {currentDate.format('MMMM YYYY')}
        </Typography>
        <Box display="flex" gap={1}>
          <IconButton 
            onClick={() => setCurrentDate(currentDate.subtract(1, calendarView === 'day' ? 'day' : calendarView))}
            sx={{ color: COLORS.primary }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton 
            onClick={() => setCurrentDate(dayjs())}
            sx={{ color: COLORS.primary }}
          >
            <TodayIcon />
          </IconButton>
          <IconButton 
            onClick={() => setCurrentDate(currentDate.add(1, calendarView === 'day' ? 'day' : calendarView))}
            sx={{ color: COLORS.primary }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Box display="flex" gap={1}>
        <IconButton
          onClick={() => setCalendarView('month')}
          sx={{ 
            color: calendarView === 'month' ? COLORS.primary : 'gray',
            bgcolor: calendarView === 'month' ? `${COLORS.primary}20` : 'transparent'
          }}
        >
          <ViewModuleIcon />
        </IconButton>
        <IconButton
          onClick={() => setCalendarView('week')}
          sx={{ 
            color: calendarView === 'week' ? COLORS.primary : 'gray',
            bgcolor: calendarView === 'week' ? `${COLORS.primary}20` : 'transparent'
          }}
        >
          <ViewWeekIcon />
        </IconButton>
        <IconButton
          onClick={() => setCalendarView('day')}
          sx={{ 
            color: calendarView === 'day' ? COLORS.primary : 'gray',
            bgcolor: calendarView === 'day' ? `${COLORS.primary}20` : 'transparent'
          }}
        >
          <ViewDayIcon />
        </IconButton>
      </Box>
    </Box>
  );

  // Render search and filters
  const renderSearchAndFilters = () => (
    <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: COLORS.background }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: COLORS.primary }} />
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Content Type</InputLabel>
            <Select
              value={contentTypeFilter}
              label="Content Type"
              onChange={(e) => setContentTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="photo">Photo</MenuItem>
              <MenuItem value="video">Video</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Jump to Date"
              value={currentDate}
              onChange={(newDate) => jumpToDate(newDate)}
              slotProps={{ 
                textField: { 
                  size: 'small',
                  fullWidth: true
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={resetFilters}
              sx={{
                borderColor: COLORS.primary,
                color: COLORS.primary,
                '&:hover': {
                  backgroundColor: `${COLORS.primary}10`,
                  borderColor: COLORS.primary
                }
              }}
            >
              Reset Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  // Render month view
  const renderMonthView = () => {
    const days = generateMonthDays();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <Paper elevation={1} sx={{ p: 2, bgcolor: COLORS.background }}>
        {/* Week headers */}
        <Grid container spacing={1} mb={1}>
          {weekDays.map((day) => (
            <Grid item xs key={day}>
              <Box textAlign="center" py={1}>
                <Typography variant="subtitle2" fontWeight="600" color={COLORS.secondary}>
                  {day}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        
        {/* Calendar days */}
        <Grid container spacing={1}>
          {days.map((day, index) => {
            const postsForDay = getPostsForDate(day);
            const isCurrentMonth = day.month() === currentDate.month();
            const isToday = day.isSame(dayjs(), 'day');
            
            return (
              <Grid item xs key={index}>
                <Box
                  sx={{
                    minHeight: '120px',
                    p: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    backgroundColor: isCurrentMonth ? COLORS.background : '#f8f9fa',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: `${COLORS.primary}10`
                    },
                    position: 'relative'
                  }}
                  onClick={() => handleDateClick(day)}
                >
                  <Typography
                    variant="body2"
                    fontWeight={isToday ? '600' : 'normal'}
                    color={isToday ? COLORS.primary : (isCurrentMonth ? COLORS.secondary : 'gray')}
                    mb={1}
                  >
                    {day.format('D')}
                  </Typography>
                  
                  {/* Posts for this day */}
                  <Box>
                    {postsForDay.slice(0, 3).map((post, postIndex) => (
                      <Box
                        key={postIndex}
                        sx={{
                          fontSize: '10px',
                          p: 0.5,
                          mb: 0.5,
                          borderRadius: 0.5,
                          backgroundColor: getStatusColor(post.status),
                          color: 'white',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {post.comments?.substring(0, 20)}...
                      </Box>
                    ))}
                    {postsForDay.length > 3 && (
                      <Typography variant="caption" color="gray">
                        +{postsForDay.length - 3} more
                      </Typography>
                    )}
                  </Box>
                  
                  {/* Post count badge */}
                  {postsForDay.length > 0 && (
                    <Badge
                      badgeContent={postsForDay.length}
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        '& .MuiBadge-badge': {
                          backgroundColor: COLORS.primary,
                          color: 'white'
                        }
                      }}
                    />
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const days = generateWeekDays();
    
    return (
      <Paper elevation={1} sx={{ p: 2, bgcolor: COLORS.background }}>
        <Grid container spacing={2}>
          {days.map((day, index) => {
            const postsForDay = getPostsForDate(day);
            const isToday = day.isSame(dayjs(), 'day');
            
            return (
              <Grid item xs key={index}>
                <Box
                  sx={{
                    minHeight: '300px',
                    p: 2,
                    border: isToday ? `2px solid ${COLORS.primary}` : '1px solid #e0e0e0',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: `${COLORS.primary}10`
                    }
                  }}
                  onClick={() => handleDateClick(day)}
                >
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    color={isToday ? COLORS.primary : COLORS.secondary}
                    mb={2}
                    textAlign="center"
                  >
                    {day.format('ddd D')}
                  </Typography>
                  
                  <Box>
                    {postsForDay.map((post, postIndex) => (
                      <Card key={postIndex} sx={{ mb: 1, boxShadow: 1 }}>
                        <CardContent sx={{ p: 1 }}>
                          <Typography variant="caption" color="gray">
                            {dayjs(post.scheduled_at).format('HH:mm')}
                          </Typography>
                          <Typography variant="body2" noWrap>
                            {post.comments?.substring(0, 30)}...
                          </Typography>
                          <Chip
                            label={post.status}
                            size="small"
                            sx={{
                              mt: 0.5,
                              backgroundColor: getStatusColor(post.status),
                              color: 'white',
                              fontSize: '10px'
                            }}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    );
  };

  // Render day view
  const renderDayView = () => {
    const postsForDay = getPostsForDate(currentDate);
    
    return (
      <Paper elevation={1} sx={{ p: 3, bgcolor: COLORS.background }}>
        <Typography variant="h5" fontWeight="600" color={COLORS.secondary} mb={3}>
          {currentDate.format('dddd, MMMM D, YYYY')}
        </Typography>
        
        {postsForDay.length === 0 ? (
          <Box textAlign="center" py={5}>
            <EventIcon sx={{ fontSize: 64, color: 'gray', mb: 2 }} />
            <Typography variant="h6" color="gray">
              No posts scheduled for this day
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {postsForDay.map((post, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ boxShadow: 2 }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="600" color={COLORS.secondary}>
                          {dayjs(post.scheduled_at).format('HH:mm')}
                        </Typography>
                        <Typography variant="body2" color="gray">
                          {post.brand_name}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={1}>
                        <Chip
                          label={post.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(post.status),
                            color: 'white'
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setSelectedPost(post);
                            setAnchorEl(e.currentTarget);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    {post.s3_url && (
                      <Box mb={2}>
                        <Avatar
                          src={post.s3_url}
                          variant="rounded"
                          sx={{ width: '100%', height: 200 }}
                        />
                      </Box>
                    )}
                    
                    <Typography variant="body2" color="text.secondary">
                      {post.comments}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh' }}>
      <Grid container>
        <Grid item xs={1}>
          <Sidebar />
        </Grid>
        <Grid item xs={11}>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              p: 1,
              backgroundColor: COLORS.secondary,
              borderBottom: '1px solid',
              borderColor: 'divider',
              borderRadius: 0
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ color: COLORS.background }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="back"
                  sx={{ mr: 2, color: COLORS.background }}
                >
                  <ArrowBackIcon />
                </IconButton>
                Calendar
              </Typography>
              <Box display="flex" gap={1}>
                <IconButton size="large" sx={{ color: COLORS.background }}>
                  <NotificationsIcon />
                </IconButton>
                <IconButton size="large" sx={{ color: COLORS.background }}>
                  <AccountCircleIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>

          {/* Main Content */}
          <Box sx={{ p: 3 }}>
            {renderCalendarHeader()}
            {renderSearchAndFilters()}
            
            {loading ? (
              <Box display="flex" justifyContent="center" py={5}>
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
        </Grid>
      </Grid>

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