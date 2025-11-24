/**
 * Comparison Utilities
 * 
 * Provides utilities for calculating and formatting metric comparisons
 */

import { ComparisonMetric } from '@/types';

/**
 * Calculate comparison between current and previous values
 */
export function calculateComparison(
    current: number,
    previous: number,
    label: string = 'vs previous period'
): ComparisonMetric {
    if (previous === 0) {
        return {
            value: current,
            percentage: current > 0 ? 100 : 0,
            isPositive: current >= 0,
            label,
        };
    }

    const difference = current - previous;
    const percentage = (difference / previous) * 100;

    return {
        value: difference,
        percentage: Math.abs(percentage),
        isPositive: difference >= 0,
        label,
    };
}

/**
 * Format comparison percentage for display
 */
export function formatComparisonPercentage(comparison: ComparisonMetric): string {
    const sign = comparison.isPositive ? '+' : '-';
    return `${sign}${comparison.percentage.toFixed(1)}%`;
}

/**
 * Format comparison value for display
 */
export function formatComparisonValue(comparison: ComparisonMetric, prefix: string = ''): string {
    const sign = comparison.isPositive ? '+' : '-';
    const absValue = Math.abs(comparison.value);
    return `${sign}${prefix}${absValue.toLocaleString()}`;
}

/**
 * Get comparison color class
 */
export function getComparisonColorClass(comparison: ComparisonMetric, inverse: boolean = false): string {
    const isPositive = inverse ? !comparison.isPositive : comparison.isPositive;
    return isPositive ? 'text-green-600' : 'text-red-600';
}

/**
 * Get comparison background color class
 */
export function getComparisonBgColorClass(comparison: ComparisonMetric, inverse: boolean = false): string {
    const isPositive = inverse ? !comparison.isPositive : comparison.isPositive;
    return isPositive ? 'bg-green-50' : 'bg-red-50';
}

/**
 * Calculate multiple comparisons
 */
export function calculateMultipleComparisons(
    currentData: Record<string, number>,
    previousData: Record<string, number>
): Record<string, ComparisonMetric> {
    const comparisons: Record<string, ComparisonMetric> = {};

    for (const key in currentData) {
        if (key in previousData) {
            comparisons[key] = calculateComparison(
                currentData[key],
                previousData[key],
                'vs previous period'
            );
        }
    }

    return comparisons;
}
