// helpful utils for the current project


// create a Table type. it is a list of objects {k1: v1, k2: v2, ...}
// where k1, k2, ... are strings
export type Table = Array<{[key: string]: unknown}>;
type NonNullType = string | number | boolean | Date;
// convert a Table to a csv string
export function tableToCSV(table: Table, keymap: {[key: string]:string}[] | null = null): string {
  if (table.length === 0) {
    return '';
  }
  // Use the object keys as the header
  let keys = Object.keys(table[0]);
  if (keymap !== null) {
    keys = keys.map(key => {
      const map = keymap.find(k => k[key] !== undefined);
      return map ? map[key] : key;
    });
  }
  const header = keys.join(',') + '\r\n';

  const body = table.map(row => {
    return keys.map(key => {
      const value = row[key];
      if (value === null || value === undefined) { return ''; }
      return value instanceof Date ? value.toISOString() : (value as NonNullType).toString();
    }).join(',') + '\r\n';
  }).join('');
  // drop the final newline

  return (header + body);
  // For WWT implementation reasons (from Windows) we need CRLF line endings
}

export function csvToTable(csv: string): Table {
  const lines = csv.split(/\r?\n|\r|\n/g);
  // remove any trailing newline
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }
  const keys = lines[0].split(',');
  const table = lines.slice(1).map(line => {
    const values = line.split(',');
    const row: {[key: string]: unknown} = {};
    keys.forEach((key, i) => {
      const value = values[i];
      row[key] = value === '' ? null : value;
    });
    return row;
  });
  return table;
}

// Polar Marsaglia RNG
export function randomNormal(mean = 0, stdDev = 1): number {
  let spare: number = 0;
  let hasSpare = false;
  let u, v, s: number;
  
  if (hasSpare) {
    hasSpare = false;
    return mean + stdDev * spare;
  } else {
    do {
      u = Math.random() * 2 - 1;
      v = Math.random() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    s = Math.sqrt(-2.0 * Math.log(s) / s);
    spare = v * s;
    hasSpare = true;
    return mean + stdDev * u * s;
  }
  
  
}


