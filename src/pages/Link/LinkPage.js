import React from 'react';
import { Container } from '@mui/material';
import Layout from '../../components/Layout';
import TabComponent from '../../components/TabComponent';

// Import the original components
import ShortLinkPage from './ShortLinkPage';
import LinkAdvancedPage from './LinkAdvancedPage';

const LinkPage = () => {
  // Create tab configuration for the switcher
  const tabs = [
    {
      label: 'ShortLink',
      content: <ShortLinkPage noLayout={true} />
    },
    {
      label: 'Link Advanced', 
      content: <LinkAdvancedPage />
    }
  ];

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <TabComponent tabs={tabs} defaultIndex={0} />
      </Container>
    </Layout>
  );
};

export default LinkPage;