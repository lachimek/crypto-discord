// Type definitions
export type Purchase = {
    symbol: string;
    price: number;
    quantity: number;
    totalSpent: number;
    date: string;
    userId: string;
}

export type PortfolioStatus = {
    symbol: string;
    totalQuantity: number;
    totalValue: number;
    averagePrice: number;
    purchases: Purchase[];
}