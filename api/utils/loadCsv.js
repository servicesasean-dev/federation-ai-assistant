import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export function loadCSVData() {
  // Make sure the file name matches exactly
  const csvPath = path.join(process.cwd(), 'data', 'federation_member_data_detailed.csv');
  
  // Read file
  const file = fs.readFileSync(csvPath, 'utf8');

  // Parse CSV
  const { data } = Papa.parse(file, {
    header: true,
    skipEmptyLines: true
  });

  return data;
}
