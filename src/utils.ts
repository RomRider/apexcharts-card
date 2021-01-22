import { compress as lzStringCompress, decompress as lzStringDecompress } from 'lz-string';

export function compress(data: any): string {
  return lzStringCompress(JSON.stringify(data));
}

export function decompress(data: any | undefined): any | undefined {
  return data !== undefined && typeof data === 'string' ? JSON.parse(lzStringDecompress(data)!) : data;
}

export function getMilli(hours: number): number {
  return hours * 60 ** 2 * 10 ** 3;
}

export function log(message): void {
  // eslint-disable-next-line no-console
  console.warn('apexcharts-card: ', message);
}
