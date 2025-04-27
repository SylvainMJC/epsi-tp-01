import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  /**
   * Truncates a string to the specified length and adds an ellipsis
   * @param value - The string to truncate
   * @param limit - The maximum length of the string (default: 20)
   * @param ellipsis - The characters to append to the truncated string (default: '...')
   * @returns The truncated string with ellipsis if needed
   */
  transform(value: string, limit: number = 20, ellipsis: string = '...'): string {
    if (!value) return '';
    
    if (value.length <= limit) return value;
    
    return value.slice(0, limit) + ellipsis;
  }
} 