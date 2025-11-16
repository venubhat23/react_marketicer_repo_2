import AxiosManager from '../utils/api';

class LinkedInAudienceAPI {
  constructor() {
    this.baseURL = 'https://api.marketincer.com/api/v1';
  }

  async getEnhancedAnalytics(organizationId) {
    try {
      const response = await AxiosManager.get(`${this.baseURL}/linkedin/enhanced-analytics`, {
        organization_id: organizationId
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching enhanced analytics:', error);
      throw error;
    }
  }

  async getAudienceInsights(organizationId, options = {}) {
    try {
      const params = {
        organization_id: organizationId,
        include_demographics: options.includeDemographics ?? true,
        include_interests: options.includeInterests ?? true,
        include_geographic: options.includeGeographic ?? true,
        include_professional: options.includeProfessional ?? true,
        date_range: options.dateRange ?? '30d',
        ...options
      };

      const response = await AxiosManager.get(`${this.baseURL}/linkedin/audience-insights`, {
        params
      });

      return this.transformAudienceInsights(response.data);
    } catch (error) {
      console.error('Error fetching audience insights:', error);
      throw error;
    }
  }

  async getFollowerDemographics(organizationId, options = {}) {
    try {
      const params = {
        organization_id: organizationId,
        breakdown_by: options.breakdownBy ?? ['job_function', 'industry', 'seniority', 'location'],
        time_period: options.timePeriod ?? '30d',
        ...options
      };

      const response = await AxiosManager.get(`${this.baseURL}/linkedin/follower-demographics`, {
        params
      });

      return this.transformDemographics(response.data);
    } catch (error) {
      console.error('Error fetching follower demographics:', error);
      throw error;
    }
  }

  async getEngagementByAudience(organizationId, options = {}) {
    try {
      const params = {
        organization_id: organizationId,
        segment_by: options.segmentBy ?? ['industry', 'job_function', 'seniority'],
        metrics: options.metrics ?? ['likes', 'comments', 'shares', 'clicks'],
        time_period: options.timePeriod ?? '30d',
        ...options
      };

      const response = await AxiosManager.get(`${this.baseURL}/linkedin/engagement-by-audience`, {
        params
      });

      return this.transformEngagementData(response.data);
    } catch (error) {
      console.error('Error fetching engagement by audience:', error);
      throw error;
    }
  }

  async getProfileViewersInsights(organizationId, options = {}) {
    try {
      const params = {
        organization_id: organizationId,
        breakdown_by: options.breakdownBy ?? ['job_function', 'industry', 'location'],
        time_period: options.timePeriod ?? '30d',
        ...options
      };

      const response = await AxiosManager.get(`${this.baseURL}/linkedin/profile-viewers`, {
        params
      });

      return this.transformProfileViewers(response.data);
    } catch (error) {
      console.error('Error fetching profile viewers insights:', error);
      throw error;
    }
  }

  async getContentPerformanceByAudience(organizationId, options = {}) {
    try {
      const params = {
        organization_id: organizationId,
        content_types: options.contentTypes ?? ['text', 'image', 'video', 'document'],
        audience_segments: options.audienceSegments ?? ['all'],
        metrics: options.metrics ?? ['engagement_rate', 'reach', 'impressions'],
        time_period: options.timePeriod ?? '30d',
        ...options
      };

      const response = await AxiosManager.get(`${this.baseURL}/linkedin/content-performance-by-audience`, {
        params
      });

      return this.transformContentPerformance(response.data);
    } catch (error) {
      console.error('Error fetching content performance by audience:', error);
      throw error;
    }
  }

  transformAudienceInsights(data) {
    if (!data || !data.data) return null;

    const insights = data.data;

    return {
      demographics: {
        jobFunctions: this.mapJobFunctions(insights.demographics?.job_functions || []),
        industries: this.mapIndustries(insights.demographics?.industries || []),
        seniorities: this.mapSeniorities(insights.demographics?.seniorities || []),
        companySizes: this.mapCompanySizes(insights.demographics?.company_sizes || []),
        locations: this.mapLocations(insights.demographics?.locations || [])
      },
      interests: {
        skills: insights.interests?.skills || [],
        topics: insights.interests?.topics || [],
        brands: insights.interests?.brands || []
      },
      professional: {
        experience_levels: insights.professional?.experience_levels || [],
        education_levels: insights.professional?.education_levels || [],
        company_growth_rates: insights.professional?.company_growth_rates || []
      },
      geographic: {
        countries: insights.geographic?.countries || [],
        regions: insights.geographic?.regions || [],
        cities: insights.geographic?.cities || []
      },
      engagement_patterns: {
        most_active_times: insights.engagement?.most_active_times || [],
        content_preferences: insights.engagement?.content_preferences || [],
        device_usage: insights.engagement?.device_usage || []
      }
    };
  }

  transformDemographics(data) {
    if (!data || !data.data) return null;

    return {
      jobFunctions: this.mapJobFunctions(data.data.job_functions || []),
      industries: this.mapIndustries(data.data.industries || []),
      seniorities: this.mapSeniorities(data.data.seniorities || []),
      locations: this.mapLocations(data.data.locations || []),
      companySizes: this.mapCompanySizes(data.data.company_sizes || []),
      totalFollowers: data.data.total_followers || 0,
      growthRate: data.data.growth_rate || 0
    };
  }

  transformEngagementData(data) {
    if (!data || !data.data) return null;

    return {
      byIndustry: data.data.by_industry || [],
      byJobFunction: data.data.by_job_function || [],
      bySeniority: data.data.by_seniority || [],
      byLocation: data.data.by_location || [],
      topPerformingSegments: data.data.top_performing_segments || [],
      engagementTrends: data.data.engagement_trends || []
    };
  }

  transformProfileViewers(data) {
    if (!data || !data.data) return null;

    return {
      totalViews: data.data.total_views || 0,
      uniqueViewers: data.data.unique_viewers || 0,
      averageViewsPerDay: data.data.average_views_per_day || 0,
      viewerDemographics: {
        jobFunctions: this.mapJobFunctions(data.data.demographics?.job_functions || []),
        industries: this.mapIndustries(data.data.demographics?.industries || []),
        locations: this.mapLocations(data.data.demographics?.locations || [])
      },
      viewerTrends: data.data.trends || []
    };
  }

  transformContentPerformance(data) {
    if (!data || !data.data) return null;

    return {
      byContentType: data.data.by_content_type || [],
      byAudienceSegment: data.data.by_audience_segment || [],
      topPerformingContent: data.data.top_performing_content || [],
      contentRecommendations: data.data.recommendations || []
    };
  }

  mapJobFunctions(functions) {
    const functionMap = {
      'urn:li:function:1': 'Accounting',
      'urn:li:function:2': 'Administrative',
      'urn:li:function:3': 'Arts and Design',
      'urn:li:function:4': 'Business Development',
      'urn:li:function:5': 'Community and Social Services',
      'urn:li:function:6': 'Consulting',
      'urn:li:function:7': 'Education',
      'urn:li:function:8': 'Engineering',
      'urn:li:function:9': 'Entrepreneurship',
      'urn:li:function:10': 'Finance',
      'urn:li:function:11': 'Healthcare Services',
      'urn:li:function:12': 'Human Resources',
      'urn:li:function:13': 'Information Technology',
      'urn:li:function:14': 'Legal',
      'urn:li:function:15': 'Marketing',
      'urn:li:function:16': 'Media and Communications',
      'urn:li:function:17': 'Military and Protective Services',
      'urn:li:function:18': 'Operations',
      'urn:li:function:19': 'Product Management',
      'urn:li:function:20': 'Program and Project Management',
      'urn:li:function:21': 'Purchasing',
      'urn:li:function:22': 'Quality Assurance',
      'urn:li:function:23': 'Real Estate',
      'urn:li:function:24': 'Research',
      'urn:li:function:25': 'Sales',
      'urn:li:function:26': 'Support'
    };

    return functions.map(func => ({
      id: func.function,
      name: functionMap[func.function] || 'Unknown',
      organicCount: func.organic_count || 0,
      paidCount: func.paid_count || 0,
      totalCount: func.total_count || 0,
      percentage: func.percentage || 0
    }));
  }

  mapIndustries(industries) {
    return industries.map(industry => ({
      id: industry.industry,
      name: this.getIndustryName(industry.industry),
      organicCount: industry.organic_count || 0,
      paidCount: industry.paid_count || 0,
      totalCount: industry.total_count || 0,
      percentage: industry.percentage || 0
    }));
  }

  mapSeniorities(seniorities) {
    const seniorityMap = {
      'urn:li:seniority:1': 'Unpaid',
      'urn:li:seniority:2': 'Training',
      'urn:li:seniority:3': 'Entry level',
      'urn:li:seniority:4': 'Associate',
      'urn:li:seniority:5': 'Mid-Senior level',
      'urn:li:seniority:6': 'Director',
      'urn:li:seniority:7': 'Executive',
      'urn:li:seniority:8': 'Senior',
      'urn:li:seniority:9': 'Manager',
      'urn:li:seniority:10': 'Owner'
    };

    return seniorities.map(seniority => ({
      id: seniority.seniority,
      name: seniorityMap[seniority.seniority] || 'Unknown',
      organicCount: seniority.organic_count || 0,
      paidCount: seniority.paid_count || 0,
      totalCount: seniority.total_count || 0,
      percentage: seniority.percentage || 0
    }));
  }

  mapCompanySizes(companySizes) {
    const sizeMap = {
      'SIZE_1': 'Self-employed',
      'SIZE_2_TO_10': '2-10 employees',
      'SIZE_11_TO_50': '11-50 employees',
      'SIZE_51_TO_200': '51-200 employees',
      'SIZE_201_TO_500': '201-500 employees',
      'SIZE_501_TO_1000': '501-1,000 employees',
      'SIZE_1001_TO_5000': '1,001-5,000 employees',
      'SIZE_5001_TO_10000': '5,001-10,000 employees',
      'SIZE_10001_OR_MORE': '10,001+ employees'
    };

    return companySizes.map(size => ({
      id: size.staff_count_range,
      name: sizeMap[size.staff_count_range] || 'Unknown',
      organicCount: size.organic_count || 0,
      paidCount: size.paid_count || 0,
      totalCount: size.total_count || 0,
      percentage: size.percentage || 0
    }));
  }

  mapLocations(locations) {
    return locations.map(location => ({
      id: location.location_id || location.country_code,
      name: location.name || location.country_name,
      type: location.type || 'country',
      organicCount: location.organic_count || 0,
      paidCount: location.paid_count || 0,
      totalCount: location.total_count || 0,
      percentage: location.percentage || 0
    }));
  }

  getIndustryName(industryId) {
    const industryMap = {
      'urn:li:industry:1': 'Accounting',
      'urn:li:industry:3': 'Airlines/Aviation',
      'urn:li:industry:4': 'Alternative Dispute Resolution',
      'urn:li:industry:5': 'Alternative Medicine',
      'urn:li:industry:6': 'Animation',
      'urn:li:industry:7': 'Apparel & Fashion',
      'urn:li:industry:8': 'Architecture & Planning',
      'urn:li:industry:9': 'Arts and Crafts',
      'urn:li:industry:10': 'Automotive',
      'urn:li:industry:11': 'Aviation & Aerospace',
      'urn:li:industry:12': 'Banking',
      'urn:li:industry:13': 'Biotechnology',
      'urn:li:industry:15': 'Broadcast Media',
      'urn:li:industry:16': 'Building Materials',
      'urn:li:industry:17': 'Business Supplies and Equipment',
      'urn:li:industry:18': 'Capital Markets',
      'urn:li:industry:19': 'Chemicals',
      'urn:li:industry:20': 'Civic & Social Organization',
      'urn:li:industry:21': 'Civil Engineering',
      'urn:li:industry:22': 'Commercial Real Estate',
      'urn:li:industry:23': 'Computer & Network Security',
      'urn:li:industry:24': 'Computer Games',
      'urn:li:industry:25': 'Computer Hardware',
      'urn:li:industry:26': 'Computer Networking',
      'urn:li:industry:27': 'Computer Software',
      'urn:li:industry:28': 'Construction',
      'urn:li:industry:29': 'Consumer Electronics',
      'urn:li:industry:30': 'Consumer Goods',
      'urn:li:industry:31': 'Consumer Services',
      'urn:li:industry:32': 'Cosmetics',
      'urn:li:industry:33': 'Dairy',
      'urn:li:industry:34': 'Defense & Space',
      'urn:li:industry:35': 'Design',
      'urn:li:industry:36': 'E-Learning',
      'urn:li:industry:37': 'Education Management',
      'urn:li:industry:38': 'Electrical/Electronic Manufacturing',
      'urn:li:industry:39': 'Entertainment',
      'urn:li:industry:40': 'Environmental Services',
      'urn:li:industry:41': 'Events Services',
      'urn:li:industry:42': 'Executive Office',
      'urn:li:industry:43': 'Facilities Services',
      'urn:li:industry:44': 'Farming',
      'urn:li:industry:45': 'Financial Services',
      'urn:li:industry:46': 'Fine Art',
      'urn:li:industry:47': 'Fishery',
      'urn:li:industry:48': 'Food & Beverages',
      'urn:li:industry:49': 'Food Production',
      'urn:li:industry:50': 'Fund-Raising',
      'urn:li:industry:51': 'Furniture',
      'urn:li:industry:52': 'Gambling & Casinos',
      'urn:li:industry:53': 'Glass, Ceramics & Concrete',
      'urn:li:industry:54': 'Government Administration',
      'urn:li:industry:55': 'Government Relations',
      'urn:li:industry:56': 'Graphic Design',
      'urn:li:industry:57': 'Health, Wellness and Fitness',
      'urn:li:industry:58': 'Higher Education',
      'urn:li:industry:59': 'Hospital & Health Care',
      'urn:li:industry:60': 'Hospitality',
      'urn:li:industry:61': 'Human Resources',
      'urn:li:industry:62': 'Import and Export',
      'urn:li:industry:63': 'Individual & Family Services',
      'urn:li:industry:64': 'Industrial Automation',
      'urn:li:industry:65': 'Information Services',
      'urn:li:industry:66': 'Information Technology and Services',
      'urn:li:industry:67': 'Insurance',
      'urn:li:industry:68': 'International Affairs',
      'urn:li:industry:69': 'International Trade and Development',
      'urn:li:industry:70': 'Internet',
      'urn:li:industry:71': 'Investment Banking',
      'urn:li:industry:72': 'Investment Management',
      'urn:li:industry:73': 'Judiciary',
      'urn:li:industry:74': 'Law Enforcement',
      'urn:li:industry:75': 'Law Practice',
      'urn:li:industry:76': 'Legal Services',
      'urn:li:industry:77': 'Legislative Office',
      'urn:li:industry:78': 'Leisure, Travel & Tourism',
      'urn:li:industry:79': 'Libraries',
      'urn:li:industry:80': 'Logistics and Supply Chain',
      'urn:li:industry:81': 'Luxury Goods & Jewelry',
      'urn:li:industry:82': 'Machinery',
      'urn:li:industry:83': 'Management Consulting',
      'urn:li:industry:84': 'Maritime',
      'urn:li:industry:85': 'Market Research',
      'urn:li:industry:86': 'Marketing and Advertising',
      'urn:li:industry:87': 'Mechanical or Industrial Engineering',
      'urn:li:industry:88': 'Media Production',
      'urn:li:industry:89': 'Medical Devices',
      'urn:li:industry:90': 'Medical Practice',
      'urn:li:industry:91': 'Mental Health Care',
      'urn:li:industry:92': 'Military',
      'urn:li:industry:93': 'Mining & Metals',
      'urn:li:industry:94': 'Motion Pictures and Film',
      'urn:li:industry:95': 'Museums and Institutions',
      'urn:li:industry:96': 'Music',
      'urn:li:industry:97': 'Nanotechnology',
      'urn:li:industry:98': 'Newspapers',
      'urn:li:industry:99': 'Non-Profit Organization Management',
      'urn:li:industry:100': 'Oil & Energy',
      'urn:li:industry:101': 'Online Media',
      'urn:li:industry:102': 'Outsourcing/Offshoring',
      'urn:li:industry:103': 'Package/Freight Delivery',
      'urn:li:industry:104': 'Packaging and Containers',
      'urn:li:industry:105': 'Paper & Forest Products',
      'urn:li:industry:106': 'Performing Arts',
      'urn:li:industry:107': 'Pharmaceuticals',
      'urn:li:industry:108': 'Philanthropy',
      'urn:li:industry:109': 'Photography',
      'urn:li:industry:110': 'Plastics',
      'urn:li:industry:111': 'Political Organization',
      'urn:li:industry:112': 'Primary/Secondary Education',
      'urn:li:industry:113': 'Printing',
      'urn:li:industry:114': 'Professional Training & Coaching',
      'urn:li:industry:115': 'Program Development',
      'urn:li:industry:116': 'Public Policy',
      'urn:li:industry:117': 'Public Relations and Communications',
      'urn:li:industry:118': 'Public Safety',
      'urn:li:industry:119': 'Publishing',
      'urn:li:industry:120': 'Railroad Manufacture',
      'urn:li:industry:121': 'Ranching',
      'urn:li:industry:122': 'Real Estate',
      'urn:li:industry:123': 'Recreational Facilities and Services',
      'urn:li:industry:124': 'Religious Institutions',
      'urn:li:industry:125': 'Renewables & Environment',
      'urn:li:industry:126': 'Research',
      'urn:li:industry:127': 'Restaurants',
      'urn:li:industry:128': 'Retail',
      'urn:li:industry:129': 'Security and Investigations',
      'urn:li:industry:130': 'Semiconductors',
      'urn:li:industry:131': 'Shipbuilding',
      'urn:li:industry:132': 'Sporting Goods',
      'urn:li:industry:133': 'Sports',
      'urn:li:industry:134': 'Staffing and Recruiting',
      'urn:li:industry:135': 'Supermarkets',
      'urn:li:industry:136': 'Telecommunications',
      'urn:li:industry:137': 'Textiles',
      'urn:li:industry:138': 'Think Tanks',
      'urn:li:industry:139': 'Tobacco',
      'urn:li:industry:140': 'Translation and Localization',
      'urn:li:industry:141': 'Transportation/Trucking/Railroad',
      'urn:li:industry:142': 'Utilities',
      'urn:li:industry:143': 'Venture Capital & Private Equity',
      'urn:li:industry:144': 'Veterinary',
      'urn:li:industry:145': 'Warehousing',
      'urn:li:industry:146': 'Wholesale',
      'urn:li:industry:147': 'Wine and Spirits',
      'urn:li:industry:148': 'Wireless',
      'urn:li:industry:149': 'Writing and Editing'
    };

    return industryMap[industryId] || 'Unknown Industry';
  }

  async getComprehensiveAudienceData(organizationId, options = {}) {
    try {
      const [
        audienceInsights,
        followerDemographics,
        engagementByAudience,
        profileViewers,
        contentPerformance
      ] = await Promise.allSettled([
        this.getAudienceInsights(organizationId, options),
        this.getFollowerDemographics(organizationId, options),
        this.getEngagementByAudience(organizationId, options),
        this.getProfileViewersInsights(organizationId, options),
        this.getContentPerformanceByAudience(organizationId, options)
      ]);

      return {
        success: true,
        data: {
          audienceInsights: audienceInsights.status === 'fulfilled' ? audienceInsights.value : null,
          followerDemographics: followerDemographics.status === 'fulfilled' ? followerDemographics.value : null,
          engagementByAudience: engagementByAudience.status === 'fulfilled' ? engagementByAudience.value : null,
          profileViewers: profileViewers.status === 'fulfilled' ? profileViewers.value : null,
          contentPerformance: contentPerformance.status === 'fulfilled' ? contentPerformance.value : null
        },
        errors: [
          audienceInsights.status === 'rejected' ? audienceInsights.reason : null,
          followerDemographics.status === 'rejected' ? followerDemographics.reason : null,
          engagementByAudience.status === 'rejected' ? engagementByAudience.reason : null,
          profileViewers.status === 'rejected' ? profileViewers.reason : null,
          contentPerformance.status === 'rejected' ? contentPerformance.reason : null
        ].filter(Boolean)
      };
    } catch (error) {
      console.error('Error fetching comprehensive audience data:', error);
      throw error;
    }
  }
}

export default new LinkedInAudienceAPI();