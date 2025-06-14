const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Quote Service using ApperClient
export const getAll = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
               'product_type', 'coverage_options', 'premium', 'valid_until']
    };
    
    const response = await apperClient.fetchRecords('quote', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching quotes:", error);
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
               'product_type', 'coverage_options', 'premium', 'valid_until']
    };
    
    const response = await apperClient.getRecordById('quote', id, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching quote with ID ${id}:`, error);
    throw error;
  }
};

export const create = async (quoteData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Calculate premium using business logic
    const premium = calculatePremium(quoteData);
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: quoteData.Name || quoteData.name || 'New Quote',
        Tags: quoteData.Tags || '',
        Owner: quoteData.Owner || 1,
        product_type: quoteData.product_type || quoteData.productType,
        coverage_options: JSON.stringify(quoteData.coverage_options || quoteData.coverageOptions || {}),
        premium: premium,
        valid_until: quoteData.valid_until || quoteData.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }]
    };
    
    const response = await apperClient.createRecord('quote', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to create quote:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create quote');
      }
      
      return response.results[0].data;
    }
    
    return response.data;
  } catch (error) {
    console.error("Error creating quote:", error);
    throw error;
  }
};

export const update = async (id, updates) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include Updateable fields plus Id
    const params = {
      records: [{
        Id: parseInt(id),
        ...(updates.Name && { Name: updates.Name }),
        ...(updates.Tags && { Tags: updates.Tags }),
        ...(updates.Owner && { Owner: updates.Owner }),
        ...(updates.product_type && { product_type: updates.product_type }),
        ...(updates.coverage_options && { coverage_options: JSON.stringify(updates.coverage_options) }),
        ...(updates.premium && { premium: updates.premium }),
        ...(updates.valid_until && { valid_until: updates.valid_until })
      }]
    };
    
    const response = await apperClient.updateRecord('quote', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to update quote:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update quote');
      }
      
      return response.results[0].data;
    }
    
    return response.data;
  } catch (error) {
    console.error("Error updating quote:", error);
    throw error;
  }
};

export const deleteQuote = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord('quote', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting quote:", error);
    throw error;
  }
};

// Premium calculation business logic (preserved from original)
export const calculatePremium = (quoteData) => {
  const { productType, product_type, coverageOptions, coverage_options } = quoteData;
  const type = productType || product_type;
  const options = coverageOptions || coverage_options;
  let basePremium = 0;

  // Base premium by product type
  switch (type) {
    case 'auto':
      basePremium = 800;
      break;
    case 'health':
      basePremium = 1200;
      break;
    case 'travel':
      basePremium = 150;
      break;
    case 'home':
      basePremium = 600;
      break;
    default:
      basePremium = 500;
  }

  // Adjust based on coverage options
  if (options) {
    if (options.coverageAmount) {
      basePremium += options.coverageAmount * 0.001;
    }
    if (options.deductible) {
      basePremium -= options.deductible * 0.1;
    }
    if (options.age && options.age > 50) {
      basePremium *= 1.2;
    }
    if (options.location === 'high-risk') {
      basePremium *= 1.3;
    }
  }

  return Math.round(basePremium);
};

export const calculateQuote = async (productType, coverageOptions) => {
  await delay(500); // Simulate calculation time
  const premium = calculatePremium({ productType, coverageOptions });
  return {
    productType,
    coverageOptions,
    premium,
    breakdown: {
      basePremium: Math.round(premium * 0.7),
      taxes: Math.round(premium * 0.18),
      fees: Math.round(premium * 0.12)
    }
  };
};

// Export default object for backward compatibility
const quoteService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteQuote,
  calculatePremium,
  calculateQuote
};

export default quoteService;