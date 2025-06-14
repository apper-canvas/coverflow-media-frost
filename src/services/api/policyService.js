import policiesData from '../mockData/policies.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PolicyService {
  constructor() {
    this.policies = [...policiesData];
  }

  async getAll() {
    await delay(300);
    return [...this.policies];
  }

  async getById(id) {
    await delay(250);
    const policy = this.policies.find(p => p.id === id);
    if (!policy) {
      throw new Error('Policy not found');
    }
    return { ...policy };
  }

  async create(policyData) {
    await delay(400);
    const newPolicy = {
      ...policyData,
      id: Date.now().toString(),
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      documents: []
    };
    this.policies.push(newPolicy);
    return { ...newPolicy };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.policies.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Policy not found');
    }
    this.policies[index] = { ...this.policies[index], ...updates };
    return { ...this.policies[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.policies.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Policy not found');
    }
    this.policies.splice(index, 1);
    return true;
  }

  async getActiveCount() {
    await delay(200);
    return this.policies.filter(p => p.status === 'active').length;
  }

  async getByType(type) {
    await delay(250);
    return this.policies.filter(p => p.type === type);
  }
}

export default new PolicyService();