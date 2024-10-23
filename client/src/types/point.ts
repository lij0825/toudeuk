export interface PointInfo {
    id: number;
    type: 'charge' | 'use';
    amount: number;
    date: string;
    description: string;
}