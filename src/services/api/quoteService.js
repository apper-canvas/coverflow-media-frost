import quotesData from '../mockData/quotes.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class QuoteService {
  constructor() {
    this.quotes = [...quotesData];
  }

  async getAll() {
    await delay(300);
    return [...this.quotes];
  }

  async getById(id) {
    await delay(250);
    const quote = this.quotes.find(q => q.id === id);
    if (!quote) {
      throw new Error('Quote not found');
    }
    return { ...quote };
  }

  async create(quoteData) {
    await delay(400);
    const newQuote = {
      ...quoteData,
      id: Date.now().toString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      premium: this.calculatePremium(quoteData)
    };
    this.quotes.push(newQuote);
    return { ...newQuote };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.quotes.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error('Quote not found');
    }
    this.quotes[index] = { ...this.quotes[index], ...updates };
    return { ...this.quotes[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.quotes.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error('Quote not found');
    }
    this.quotes.splice(index, 1);
    return true;
  }

  calculatePremium(quoteData) {
    const { productType, coverageOptions } = quoteData;
    let basePremium = 0;

    // Base premium by product type
    switch (productType) {
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
    if (coverageOptions) {
      if (coverageOptions.coverageAmount) {
        basePremium += coverageOptions.coverageAmount * 0.001;
      }
      if (coverageOptions.deductible) {
        basePremium -= coverageOptions.deductible * 0.1;
      }
      if (coverageOptions.age && coverageOptions.age > 50) {
        basePremium *= 1.2;
      }
      if (coverageOptions.location === 'high-risk') {
        basePremium *= 1.3;
      }
    }

    return Math.round(basePremium);
  }

  async calculateQuote(productType, coverageOptions) {
    await delay(500); // Simulate calculation time
    const premium = this.calculatePremium({ productType, coverageOptions });
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
  }
}

export default new QuoteService();