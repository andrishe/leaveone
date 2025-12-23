/**
 * CSV export utilities
 */

/**
 * Converts an array of objects to CSV format
 */
export function arrayToCSV<T extends Record<string, any>>(
  data: T[],
  headers?: Record<keyof T, string>
): string {
  if (data.length === 0) {
    return '';
  }

  const keys = Object.keys(data[0]) as (keyof T)[];

  // Use provided headers or default to keys
  const headerLabels = headers
    ? keys.map((key) => headers[key] || String(key))
    : keys.map(String);

  // Create header row
  const headerRow = headerLabels.map(escapeCSVValue).join(',');

  // Create data rows
  const dataRows = data.map((row) => {
    return keys
      .map((key) => {
        const value = row[key];
        return escapeCSVValue(formatValue(value));
      })
      .join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Escapes a value for CSV format
 */
function escapeCSVValue(value: string): string {
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Formats a value for CSV export
 */
function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toLocaleDateString('fr-FR');
  }

  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

/**
 * Creates a CSV download response
 */
export function createCSVResponse(
  csv: string,
  filename: string
): Response {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  return new Response(blob, {
    headers: {
      'Content-Type': 'text/csv;charset=utf-8;',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
