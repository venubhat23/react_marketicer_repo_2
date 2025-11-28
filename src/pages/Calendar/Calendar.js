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
  ViewDay as ViewDayIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon
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
  failed: '#EF5350',
  instagram: '#E4405F',
  facebook: '#4267B2',
  twitter: '#1DA1F2',
  linkedin: '#0077B5'
};

// Status colors mapping
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'scheduled': return COLORS.scheduled;
    case 'published': return COLORS.published;
    case 'draft': return COLORS.draft;
    case 'failed': return COLORS.failed;
    case 'publish': return COLORS.published;
    default: return COLORS.primary;
  }
};

const getPlatformColor = (post) => {
  const platform = post.page_data?.page_type?.toLowerCase();
  switch (platform) {
    case 'instagram': return COLORS.instagram;
    case 'facebook': return COLORS.facebook;
    case 'twitter': return COLORS.twitter;
    case 'linkedin': return COLORS.linkedin;
    default: return COLORS.primary;
  }
};

const Calendar = () => {
  // State management
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [calendarView, setCalendarView] = useState('month'); // month, week, day
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState({ from: null, to: null });
  const [accountsFilter, setAccountsFilter] = useState([""]);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [selectedDatePosts, setSelectedDatePosts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);


  // Fetch connected accounts
  const fetchConnectedAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://api.marketincer.com/api/v1/social_pages/connected_pages',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.data && response.data.data.accounts) {
        setConnectedAccounts(response.data.data.accounts);
        console.log('Connected accounts loaded:', response.data.data.accounts);
      }
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
    }
  };

  // Fetch all posts from API with filters
  const fetchScheduledPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Build query parameters
      const params = new URLSearchParams();

      // Add search query
      if (searchQuery) {
        params.append('query', searchQuery);
      }

      // Add status filter
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      // Add date range filter
      if (dateRangeFilter.from && dateRangeFilter.to) {
        params.append('from', dateRangeFilter.from.format('YYYY-MM-DD'));
        params.append('to', dateRangeFilter.to.format('YYYY-MM-DD'));
      }

      // Add account filters (only if specific accounts are selected, not "All Accounts")
      const specificAccounts = accountsFilter.filter(accountId => accountId !== "");
      if (specificAccounts.length > 0) {
        specificAccounts.forEach(accountId => {
          params.append('account_ids[]', accountId);
        });
      }

      const queryString = params.toString();
      const url = `https://api.marketincer.com/api/v1/posts/search${queryString ? `?${queryString}` : ''}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.posts) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectedAccounts();
    fetchScheduledPosts();
  }, []);

  // Trigger API call when filters change
  useEffect(() => {
    fetchScheduledPosts();
  }, [searchQuery, statusFilter, dateRangeFilter, accountsFilter]);

  // Since we're doing server-side filtering, we can use posts directly
  const filteredPosts = posts;

  // Get posts for a specific date
  const getPostsForDate = (date) => {
    return filteredPosts.filter(post => {
      // Use scheduled_at if available and valid, otherwise use created_at
      const postDate = post.scheduled_at ? dayjs(post.scheduled_at) : dayjs(post.created_at);
      return postDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
    });
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

  // Handle opening edit dialog
  const handleEditPost = (post) => {
    setEditingPost({
      ...post,
      comments: post.comments || '',
      hashtags: post.hashtags || '',
      note: post.note || '',
      brand_name: post.brand_name || '',
      scheduled_at: post.scheduled_at ? dayjs(post.scheduled_at).format('YYYY-MM-DDTHH:mm') : ''
    });
    setOpenEditDialog(true);
    setIsEditing(false);
    setAnchorEl(null);
  };

  // Handle saving edited post
  const handleSavePost = async () => {
    if (!editingPost) return;

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        post: {
          comments: editingPost.comments,
          hashtags: editingPost.hashtags,
          note: editingPost.note,
          brand_name: editingPost.brand_name,
          scheduled_at: editingPost.scheduled_at ? dayjs(editingPost.scheduled_at).toISOString() : null,
          status: editingPost.status
        }
      };

      await axios.put(
        `https://api.marketincer.com/api/v1/posts/${editingPost.post_id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Post updated successfully!');
      setOpenEditDialog(false);
      setEditingPost(null);
      setIsEditing(false);
      fetchScheduledPosts(); // Refresh data
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  // Handle deleting post
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.delete(
        `https://api.marketincer.com/api/v1/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Post deleted successfully!');
      setOpenEditDialog(false);
      setEditingPost(null);
      setAnchorEl(null);
      fetchScheduledPosts(); // Refresh data
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  // Handle input changes in edit form
  const handleEditInputChange = (field, value) => {
    // Prevent any changes if the post is already published
    if (editingPost?.status === 'published') {
      return;
    }

    setEditingPost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateRangeFilter({ from: null, to: null });
    setAccountsFilter([""]);
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
    
    // Debug logging for November 2025
    if (currentDate.month() === 10 && currentDate.year() === 2025) {
      const novemberDays = days.filter(d => d.month() === 10);
      console.log('November 2025 Debug:');
      console.log('Total days:', days.length);
      console.log('November days count:', novemberDays.length);
      console.log('November days:', novemberDays.map(d => d.format('YYYY-MM-DD')));
      console.log('Days in November 2025:', currentDate.daysInMonth());
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
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: '700px' }}>
        {/* Week headers */}
        <Box 
          display="grid" 
          gridTemplateColumns="repeat(7, 1fr)" 
          gap={0}
          sx={{ borderBottom: '2px solid #e0e0e0', mb: 0.5, position: 'sticky', top: 0, zIndex: 1, bgcolor: '#fff' }}
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
          sx={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'visible', minHeight: '720px' }}
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
                  {postsForDay.slice(0, 2).map((post, postIndex) => {
                    const postDate = post.scheduled_at ? dayjs(post.scheduled_at) : dayjs(post.created_at);
                    const platformColor = getPlatformColor(post);
                    return (
                      <Box
                        key={postIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPost(post);
                        }}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.3,
                          fontSize: '8px',
                          p: 0.3,
                          mb: 0.3,
                          borderRadius: 0.5,
                          backgroundColor: `${getStatusColor(post.status)}15`,
                          border: `1px solid ${getStatusColor(post.status)}`,
                          overflow: 'hidden',
                          position: 'relative',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: `${getStatusColor(post.status)}25`,
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        {/* Platform indicator */}
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: platformColor,
                            flexShrink: 0
                          }}
                        />
                        <Box
                          sx={{
                            fontSize: '8px',
                            color: getStatusColor(post.status),
                            fontWeight: '600',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {postDate.format('h:mm A')} {post.brand_name ? `- ${post.brand_name.substring(0, 8)}` : ''}
                        </Box>
                      </Box>
                    );
                  })}
                  {postsForDay.length > 2 && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: COLORS.primary,
                        fontWeight: '600',
                        fontSize: '7px',
                        textAlign: 'center',
                        mt: 0.2
                      }}
                    >
                      +{postsForDay.length - 2} more
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
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
        {/* Week header */}
        <Box 
          display="grid" 
          gridTemplateColumns="repeat(7, 1fr)" 
          gap={0}
          sx={{ borderBottom: '2px solid #e0e0e0', mb: 1, position: 'sticky', top: 0, zIndex: 1, bgcolor: '#fff' }}
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
          sx={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'visible', minHeight: '500px' }}
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
                <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: '450px' }}>
                  {postsForDay.map((post, postIndex) => {
                    const postDate = post.scheduled_at ? dayjs(post.scheduled_at) : dayjs(post.created_at);
                    const platformColor = getPlatformColor(post);
                    return (
                      <Card
                        key={postIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPost(post);
                        }}
                        sx={{
                          mb: 1,
                          boxShadow: 1,
                          borderLeft: `3px solid ${platformColor}`,
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: 2,
                            transform: 'translateY(-1px)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                          <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: platformColor
                              }}
                            />
                            <Typography variant="caption" color={COLORS.primary} fontWeight="600">
                              {postDate.format('h:mm A')}
                            </Typography>
                            <Typography variant="caption" color="gray" sx={{ ml: 'auto', fontSize: '10px' }}>
                              {post.page_data?.page_type || 'Unknown'}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontSize: '11px', mb: 0.5, lineHeight: 1.3 }}>
                            {post.comments?.substring(0, 35)}...
                          </Typography>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Chip
                              label={post.status}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(post.status),
                                color: 'white',
                                fontSize: '8px',
                                height: '16px',
                                '& .MuiChip-label': { px: 0.5 }
                              }}
                            />
                            {post.brand_name && (
                              <Typography variant="caption" sx={{ fontSize: '9px', color: 'gray' }}>
                                {post.brand_name}
                              </Typography>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })}
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
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
        <Box sx={{ mb: 2, p: 2, bgcolor: COLORS.background, borderRadius: 1, border: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 1 }}>
          <Typography variant="h5" fontWeight="500" color={COLORS.secondary} textAlign="center">
            {currentDate.format('dddd, MMMM D, YYYY')}
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
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
              {postsForDay.map((post, index) => {
                const postDate = post.scheduled_at ? dayjs(post.scheduled_at) : dayjs(post.created_at);
                const platformColor = getPlatformColor(post);
                return (
                  <Card
                    key={index}
                    onClick={() => handleEditPost(post)}
                    sx={{
                      boxShadow: 2,
                      height: 'fit-content',
                      borderLeft: `4px solid ${platformColor}`,
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: platformColor
                            }}
                          />
                          <Box>
                            <Typography variant="h6" fontWeight="600" color={COLORS.primary}>
                              {postDate.format('h:mm A')}
                            </Typography>
                            <Typography variant="body2" color="gray" sx={{ fontSize: '12px' }}>
                              {post.brand_name || 'No Brand'} • {post.page_data?.page_type || 'Unknown Platform'}
                            </Typography>
                          </Box>
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
                );
              })}
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
        overflow: 'auto'
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
                  <MenuItem value="failed" sx={{ fontSize: '14px' }}>Failed</MenuItem>
                  <MenuItem value="draft" sx={{ fontSize: '14px' }}>Draft</MenuItem>
                  <MenuItem value="publish" sx={{ fontSize: '14px' }}>Publish</MenuItem>
                </Select>
              </FormControl>
              
              {/* Date Range Filter */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From Date"
                  value={dateRangeFilter.from}
                  onChange={(newValue) => setDateRangeFilter(prev => ({ ...prev, from: newValue }))}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        width: 150,
                        '& .MuiInputBase-root': {
                          height: '36px',
                          bgcolor: '#fff',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }
                      }
                    }
                  }}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="To Date"
                  value={dateRangeFilter.to}
                  onChange={(newValue) => setDateRangeFilter(prev => ({ ...prev, to: newValue }))}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        width: 150,
                        '& .MuiInputBase-root': {
                          height: '36px',
                          bgcolor: '#fff',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }
                      }
                    }
                  }}
                />
              </LocalizationProvider>

              {/* Accounts Filter */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel sx={{ fontSize: '14px', color: '#666' }}>Accounts</InputLabel>
                <Select
                  multiple
                  value={accountsFilter}
                  label="Accounts"
                  onChange={(e) => setAccountsFilter(e.target.value)}
                  renderValue={(selected) => {
                    if (selected.length === 0 || (selected.length === 1 && selected[0] === "")) {
                      return "All Accounts";
                    }
                    // Filter out empty string for "All Accounts"
                    const filteredSelected = selected.filter(value => value !== "");
                    if (filteredSelected.length === 0) {
                      return "All Accounts";
                    }
                    return (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {filteredSelected.map((value) => {
                          const account = connectedAccounts.find(acc => acc.social_id === value);
                          return (
                            <Chip
                              key={value}
                              label={account?.name || 'Unknown'}
                              size="small"
                              sx={{ height: '20px', fontSize: '11px' }}
                            />
                          );
                        })}
                      </Box>
                    );
                  }}
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
                  <MenuItem value="" sx={{ fontSize: '14px' }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: COLORS.primary
                        }}
                      />
                      All Accounts
                    </Box>
                  </MenuItem>
                  {connectedAccounts.map((account) => (
                    <MenuItem key={account.social_id} value={account.social_id} sx={{ fontSize: '14px' }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: account.page_type === 'instagram' ? COLORS.instagram :
                                            account.page_type === 'facebook' ? COLORS.facebook :
                                            account.page_type === 'linkedin' ? COLORS.linkedin : COLORS.primary
                          }}
                        />
                        {account.name}
                      </Box>
                    </MenuItem>
                  ))}
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
        <Box sx={{ flex: 1, overflow: 'auto', px: 3, pt: 1, pb: 3, height: 'calc(100vh - 180px)' }}>
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
                  <ListItem
                    alignItems="flex-start"
                    button
                    onClick={() => {
                      setOpenPostDialog(false);
                      handleEditPost(post);
                    }}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(136, 42, 255, 0.05)'
                      }
                    }}
                  >
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
                            {(post.scheduled_at ? dayjs(post.scheduled_at) : dayjs(post.created_at)).format('h:mm A')} - {post.brand_name || 'No Brand'}
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
                                onClick={() => handlePostAction(post.post_id, 'publish')}
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
          <MenuItem onClick={() => handlePostAction(selectedPost.post_id, 'publish')}>
            <PublishIcon sx={{ mr: 1 }} />
            Publish Now
          </MenuItem>
        )}
        {selectedPost?.status !== 'published' && (
          <MenuItem onClick={() => handleEditPost(selectedPost)}>
            <EditIcon sx={{ mr: 1 }} />
            Edit Post
          </MenuItem>
        )}
        <MenuItem
          onClick={() => handleDeletePost(selectedPost?.post_id)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Post
        </MenuItem>
      </Menu>

      {/* Edit Post Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => {
          if (!isEditing) {
            setOpenEditDialog(false);
            setEditingPost(null);
          }
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="600">
              {isEditing ? 'Edit Post' : 'Post Details'}
            </Typography>
            <Box display="flex" gap={1}>
              {!isEditing && editingPost?.status !== 'published' && (
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{ color: COLORS.primary }}
                >
                  Edit
                </Button>
              )}
              <Button
                startIcon={<DeleteIcon />}
                onClick={() => handleDeletePost(editingPost?.post_id)}
                sx={{ color: 'error.main' }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {editingPost && (
            <Box sx={{ mt: 1 }}>
              {/* Post Media */}
              {editingPost.s3_url && (
                <Box mb={3}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: '600' }}>
                    Media
                  </Typography>
                  <Box
                    component="img"
                    src={editingPost.s3_url}
                    alt="Post media"
                    sx={{
                      width: '100%',
                      maxHeight: 300,
                      objectFit: 'cover',
                      borderRadius: 2,
                      border: '1px solid #e0e0e0'
                    }}
                  />
                </Box>
              )}

              {/* Platform Info */}
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: getPlatformColor(editingPost)
                  }}
                />
                <Typography variant="body2" color="gray">
                  {editingPost.page_data?.name || 'Unknown Page'} • {editingPost.page_data?.page_type || 'Unknown Platform'}
                </Typography>
                <Chip
                  label={editingPost.status}
                  size="small"
                  sx={{
                    backgroundColor: getStatusColor(editingPost.status),
                    color: 'white',
                    fontSize: '11px',
                    height: '20px'
                  }}
                />
              </Box>

              {/* Editable Fields */}
              <Box sx={{ '& > *': { mb: 2 } }}>
                <TextField
                  fullWidth
                  label="Brand Name"
                  value={editingPost.brand_name}
                  onChange={(e) => handleEditInputChange('brand_name', e.target.value)}
                  disabled={!isEditing || editingPost.status === 'published'}
                  variant={isEditing && editingPost.status !== 'published' ? 'outlined' : 'standard'}
                />

                <TextField
                  fullWidth
                  label="Comments/Caption"
                  value={editingPost.comments}
                  onChange={(e) => handleEditInputChange('comments', e.target.value)}
                  disabled={!isEditing || editingPost.status === 'published'}
                  variant={isEditing && editingPost.status !== 'published' ? 'outlined' : 'standard'}
                  multiline
                  rows={3}
                />

                <TextField
                  fullWidth
                  label="Hashtags"
                  value={editingPost.hashtags}
                  onChange={(e) => handleEditInputChange('hashtags', e.target.value)}
                  disabled={!isEditing || editingPost.status === 'published'}
                  variant={isEditing && editingPost.status !== 'published' ? 'outlined' : 'standard'}
                />

                <TextField
                  fullWidth
                  label="Note"
                  value={editingPost.note}
                  onChange={(e) => handleEditInputChange('note', e.target.value)}
                  disabled={!isEditing || editingPost.status === 'published'}
                  variant={isEditing && editingPost.status !== 'published' ? 'outlined' : 'standard'}
                  multiline
                  rows={2}
                />

                {/* Status Selection */}
                {isEditing && editingPost.status !== 'published' && (
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editingPost.status}
                      label="Status"
                      onChange={(e) => handleEditInputChange('status', e.target.value)}
                    >
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="scheduled">Scheduled</MenuItem>
                      <MenuItem value="published">Published</MenuItem>
                    </Select>
                  </FormControl>
                )}

                {/* Display status as read-only for published posts */}
                {editingPost.status === 'published' && (
                  <TextField
                    fullWidth
                    label="Status"
                    value="Published"
                    disabled
                    variant="standard"
                    sx={{
                      '& .MuiInputBase-input': {
                        color: getStatusColor('published'),
                        fontWeight: 'bold'
                      }
                    }}
                  />
                )}

                {/* Scheduled Date/Time */}
                {isEditing && editingPost.status !== 'published' && (editingPost.status === 'scheduled' || editingPost.scheduled_at) && (
                  <TextField
                    fullWidth
                    label="Scheduled Date & Time"
                    type="datetime-local"
                    value={editingPost.scheduled_at}
                    onChange={(e) => handleEditInputChange('scheduled_at', e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}

                {!isEditing && editingPost.scheduled_at && (
                  <TextField
                    fullWidth
                    label="Scheduled Date & Time"
                    value={dayjs(editingPost.scheduled_at).format('YYYY-MM-DD h:mm A')}
                    disabled
                    variant="standard"
                  />
                )}

                {/* Timestamps */}
                <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" color="gray" sx={{ fontSize: '12px' }}>
                    Created: {dayjs(editingPost.created_at).format('MMM D, YYYY h:mm A')}
                  </Typography>
                  {editingPost.scheduled_at && (
                    <Typography variant="body2" color="gray" sx={{ fontSize: '12px', mt: 0.5 }}>
                      Scheduled: {dayjs(editingPost.scheduled_at).format('MMM D, YYYY h:mm A')}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {isEditing ? (
            <>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  // Reset to original values if needed
                }}
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePost}
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ backgroundColor: COLORS.primary }}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setOpenEditDialog(false)}>
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;