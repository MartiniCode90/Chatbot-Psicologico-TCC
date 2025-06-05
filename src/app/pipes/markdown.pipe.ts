import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import { SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {
  transform(value: string | SafeHtml): string {
    const rawValue = typeof value === 'string' ? value : value.toString();
    return <string>marked.parse(rawValue, {breaks: true});
  }
}
