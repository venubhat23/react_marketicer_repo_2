import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import settingsApi from '../services/settingsApi';

// Query keys
const SETTINGS_KEYS = {
  settings: 'settings',
  timezones: 'timezones',
};

// Custom hook to get settings
export const useGetSettings = () => {
  return useQuery({
    queryKey: [SETTINGS_KEYS.settings],
    queryFn: settingsApi.getSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch settings');
    },
  });
};

// Custom hook to update personal information
export const useUpdatePersonalInformation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updatePersonalInformation,
    onSuccess: (data) => {
      // Update the cache with new data
      queryClient.setQueryData([SETTINGS_KEYS.settings], (oldData) => ({
        ...oldData,
        data: {
          ...oldData?.data,
          personal_information: data.data,
        },
      }));
      toast.success(data.message || 'Personal information updated successfully');
    },
    onError: (error) => {
      console.error('Personal information update error:', error);
      
      // Handle validation errors
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach(err => toast.error(err));
      } else {
        const errorMessage = error.message || 'Failed to update personal information';
        toast.error(errorMessage);
      }
    },
  });
};

// Custom hook to update company details
export const useUpdateCompanyDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updateCompanyDetails,
    onSuccess: (data) => {
      // Update the cache with new data
      queryClient.setQueryData([SETTINGS_KEYS.settings], (oldData) => ({
        ...oldData,
        data: {
          ...oldData?.data,
          company_details: data.data,
        },
      }));
      toast.success(data.message || 'Company details updated successfully');
    },
    onError: (error) => {
      console.error('Company details update error:', error);
      
      // Handle validation errors
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach(err => toast.error(err));
      } else {
        const errorMessage = error.message || 'Failed to update company details';
        toast.error(errorMessage);
      }
    },
  });
};

// Custom hook to change password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: settingsApi.changePassword,
    onSuccess: (data) => {
      toast.success(data.message || 'Password updated successfully');
    },
    onError: (error) => {
      console.error('Password change error:', error);
      
      // Handle validation errors
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach(err => toast.error(err));
      } else {
        const errorMessage = error.message || 'Failed to update password';
        toast.error(errorMessage);
      }
    },
  });
};

// Custom hook to get available timezones
export const useGetTimezones = () => {
  return useQuery({
    queryKey: [SETTINGS_KEYS.timezones],
    queryFn: settingsApi.getTimezones,
    staleTime: 60 * 60 * 1000, // 1 hour (timezones don't change often)
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch timezones');
    },
  });
};

// Custom hook to update user timezone
export const useUpdateTimezone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updateTimezone,
    onSuccess: (data) => {
      // Update the settings cache with new timezone
      queryClient.setQueryData([SETTINGS_KEYS.settings], (oldData) => ({
        ...oldData,
        data: {
          ...oldData?.data,
          timezone: data.data?.timezone,
        },
      }));
      toast.success(data.message || 'Timezone updated successfully');
    },
    onError: (error) => {
      console.error('Timezone update error:', error);
      
      // Handle validation errors
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach(err => toast.error(err));
      } else {
        const errorMessage = error.message || 'Failed to update timezone';
        toast.error(errorMessage);
      }
    },
  });
};

// Custom hook to delete user account
export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: settingsApi.deleteAccount,
    onSuccess: (data) => {
      toast.success(data.message || 'Account deleted successfully. We\'re sorry to see you go!');
      
      // Clear all cached data
      // Note: In a real app, you might want to redirect to login or home page
      // and clear authentication tokens
      localStorage.removeItem('auth_token');
      sessionStorage.clear();
      
      // Redirect to home page or login page
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    },
    onError: (error) => {
      console.error('Account deletion error:', error);
      
      // Handle validation errors
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach(err => toast.error(err));
      } else {
        const errorMessage = error.message || 'Failed to delete account';
        toast.error(errorMessage);
      }
    },
  });
};