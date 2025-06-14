const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Claim Service using ApperClient
export const getAll = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
               'type', 'amount', 'status', 'filed_date', 'description', 'incident_date', 
               'location', 'documents', 'policy_id']
    };
    
    const response = await apperClient.fetchRecords('claim', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching claims:", error);
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
               'type', 'amount', 'status', 'filed_date', 'description', 'incident_date', 
               'location', 'documents', 'policy_id']
    };
    
    const response = await apperClient.getRecordById('claim', id, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching claim with ID ${id}:`, error);
    throw error;
  }
};

export const create = async (claimData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: claimData.Name || claimData.name || 'New Claim',
        Tags: claimData.Tags || '',
        Owner: claimData.Owner || 1,
        type: claimData.type,
        amount: claimData.amount,
        status: claimData.status || 'submitted',
        filed_date: claimData.filed_date || claimData.filedDate || new Date().toISOString(),
        description: claimData.description,
        incident_date: claimData.incident_date || claimData.incidentDate,
        location: claimData.location,
        documents: claimData.documents || '',
        policy_id: parseInt(claimData.policy_id || claimData.policyId)
      }]
    };
    
    const response = await apperClient.createRecord('claim', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to create claim:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create claim');
      }
      
      return response.results[0].data;
    }
    
    return response.data;
  } catch (error) {
    console.error("Error creating claim:", error);
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
        ...(updates.amount && { amount: updates.amount }),
        ...(updates.status && { status: updates.status }),
        ...(updates.filed_date && { filed_date: updates.filed_date }),
        ...(updates.description && { description: updates.description }),
        ...(updates.incident_date && { incident_date: updates.incident_date }),
        ...(updates.location && { location: updates.location }),
        ...(updates.documents && { documents: updates.documents }),
        ...(updates.policy_id && { policy_id: parseInt(updates.policy_id) })
      }]
    };
    
    const response = await apperClient.updateRecord('claim', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to update claim:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update claim');
      }
      
      return response.results[0].data;
    }
    
    return response.data;
  } catch (error) {
    console.error("Error updating claim:", error);
    throw error;
  }
};

export const deleteClaim = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord('claim', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting claim:", error);
    throw error;
  }
};

export const getByPolicyId = async (policyId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
               'type', 'amount', 'status', 'filed_date', 'description', 'incident_date', 
               'location', 'documents', 'policy_id'],
      where: [{
        FieldName: 'policy_id',
        Operator: 'EqualTo',
        Values: [parseInt(policyId)]
      }]
    };
    
    const response = await apperClient.fetchRecords('claim', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching claims by policy ID:", error);
    throw error;
  }
};

export const getRecentClaims = async (limit = 5) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
               'type', 'amount', 'status', 'filed_date', 'description', 'incident_date', 
               'location', 'documents', 'policy_id'],
      orderBy: [{
        FieldName: 'filed_date',
        SortType: 'DESC'
      }],
      PagingInfo: {
        Limit: limit,
        Offset: 0
      }
    };
    
    const response = await apperClient.fetchRecords('claim', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching recent claims:", error);
    throw error;
  }
};

// Export default object for backward compatibility
const claimService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteClaim,
  getByPolicyId,
  getRecentClaims
};

export default claimService;