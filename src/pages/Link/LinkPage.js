import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LinkPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to ShortLinkPage by default for backward compatibility
    navigate('/link', { replace: true });
  }, [navigate]);

  return null; // This component just redirects
};

export default LinkPage;