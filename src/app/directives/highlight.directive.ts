import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight: boolean | string = true;
  @Input() highlightColor: string = '#fff3cd';
  
  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    if (this.appHighlight === '' || this.appHighlight === true) {
      this.highlight();
    }
  }

  private highlight() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', this.highlightColor);
    this.renderer.setStyle(this.el.nativeElement, 'font-weight', 'bold');
    this.renderer.setStyle(this.el.nativeElement, 'padding', '2px 5px');
    this.renderer.setStyle(this.el.nativeElement, 'border-radius', '3px');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.3s ease');
  }
}
