import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textFormat',
  standalone: true
})
export class TextFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    const withSpaces = value.replace(/_/g, ' ');
    
    const words = withSpaces.split(' ');
    
    if (words.length === 0) return '';
    
    const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
    
    const restWords = words.slice(1).map(word => word.toLowerCase());
    
    return [firstWord, ...restWords].join(' ');
  }
} 