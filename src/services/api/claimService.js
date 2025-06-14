import claimsData from '../mockData/claims.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ClaimService {
  constructor() {
    this.claims = [...claimsData];
  }

  async getAll() {
    await delay(300);
    return [...this.claims];
  }

  async getById(id) {
    await delay(250);
    const claim = this.claims.find(c => c.id === id);
    if (!claim) {
      throw new Error('Claim not found');
    }
    return { ...claim };
  }

  async create(claimData) {
    await delay(400);
    const newClaim = {
      ...claimData,
      id: Date.now().toString(),
      status: 'submitted',
      filedDate: new Date().toISOString(),
      documents: claimData.documents || []
    };
    this.claims.push(newClaim);
    return { ...newClaim };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.claims.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Claim not found');
    }
    this.claims[index] = { ...this.claims[index], ...updates };
    return { ...this.claims[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.claims.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Claim not found');
    }
    this.claims.splice(index, 1);
    return true;
  }

  async getByPolicyId(policyId) {
    await delay(250);
    return this.claims.filter(c => c.policyId === policyId);
  }

  async getRecentClaims(limit = 5) {
    await delay(200);
    return [...this.claims]
      .sort((a, b) => new Date(b.filedDate) - new Date(a.filedDate))
      .slice(0, limit);
  }
}

export default new ClaimService();