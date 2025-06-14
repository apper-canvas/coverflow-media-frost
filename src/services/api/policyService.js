const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Policy Service using ApperClient
export const getAll = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
               'type', 'coverage_amount', 'premium', 'start_date', 'end_date', 'status', 
               'vehicle_info', 'property_info', 'trip_info', 'documents']
    };
    
    const response = await apperClient.fetchRecords('policy', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching policies:", error);
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
               'type', 'coverage_amount', 'premium', 'start_date', 'end_date', 'status', 
               'vehicle_info', 'property_info', 'trip_info', 'documents']
    };
    
    const response = await apperClient.getRecordById('policy', id, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching policy with ID ${id}:`, error);
    throw error;
  }
};

export const create = async (policyData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: policyData.Name || policyData.name || 'New Policy',
        Tags: policyData.Tags || '',
        Owner: policyData.Owner || 1,
        type: policyData.type,
        coverage_amount: policyData.coverage_amount || policyData.coverageAmount,
        premium: policyData.premium,
        start_date: policyData.start_date || policyData.startDate,
        end_date: policyData.end_date || policyData.endDate,
        status: policyData.status || 'active',
        vehicle_info: policyData.vehicle_info || '',
        property_info: policyData.property_info || '',
        trip_info: policyData.trip_info || '',
        documents: policyData.documents || ''
      }]
    };
    
    const response = await apperClient.createRecord('policy', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to create policy:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create policy');
      }
      
      return response.results[0].data;
    }
    
    return response.data;
  } catch (error) {
    console.error("Error creating policy:", error);
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
        ...(updates.type && { type: updates.type }),
        ...(updates.coverage_amount && { coverage_amount: updates.coverage_amount }),
        ...(updates.premium && { premium: updates.premium }),
        ...(updates.start_date && { start_date: updates.start_date }),
        ...(updates.end_date && { end_date: updates.end_date }),
        ...(updates.status && { status: updates.status }),
        ...(updates.vehicle_info && { vehicle_info: updates.vehicle_info }),
        ...(updates.property_info && { property_info: updates.property_info }),
        ...(updates.trip_info && { trip_info: updates.trip_info }),
        ...(updates.documents && { documents: updates.documents })
      }]
    };
    
    const response = await apperClient.updateRecord('policy', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to update policy:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update policy');
      }
      
      return response.results[0].data;
    }
    
    return response.data;
  } catch (error) {
    console.error("Error updating policy:", error);
    throw error;
  }
};

export const deletePolicy = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord('policy', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting policy:", error);
    throw error;
  }
};

export const getActiveCount = async () => {
  try {
    const policies = await getAll();
    return policies.filter(p => p.status === 'active').length;
  } catch (error) {
    console.error("Error getting active count:", error);
    return 0;
  }
};

export const getByType = async (type) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
               'type', 'coverage_amount', 'premium', 'start_date', 'end_date', 'status', 
               'vehicle_info', 'property_info', 'trip_info', 'documents'],
      where: [{
        FieldName: 'type',
        Operator: 'ExactMatch',
        Values: [type]
      }]
    };
    
    const response = await apperClient.fetchRecords('policy', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching policies by type:", error);
    throw error;
  }
};

// Export default object for backward compatibility
const policyService = {
  getAll,
  getById,
  create,
  update,
  delete: deletePolicy,
  getActiveCount,
  getByType
};

export default policyService;