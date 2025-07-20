import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import settingsApi from '../services/settingsApi';

// Query keys
const SETTINGS_KEYS = {
  settings: 'settings',
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
      const errorMessage = error.message || 'Failed to update personal information';
      toast.error(errorMessage);
      
      // Handle validation errors
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach(err => toast.error(err));
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
      const errorMessage = error.message || 'Failed to update company details';
      toast.error(errorMessage);
      
      // Handle validation errors
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach(err => toast.error(err));
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
      const errorMessage = error.message || 'Failed to update password';
      toast.error(errorMessage);
      
      // Handle validation errors
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach(err => toast.error(err));
      }
    },
  });
};