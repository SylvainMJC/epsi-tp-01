import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TextFormatPipe } from '../../pipes/text-format.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TextFormatPipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() title: string = '';
} 