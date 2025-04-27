import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { Location } from '@angular/common';
import { HighlightDirective } from '../../directives/highlight.directive';
import { NotificationService } from '../../services/notification.service';
import { TitleCasePipe } from '../../pipes/title-case.pipe';
import { TextFormatPipe } from '../../pipes/text-format.pipe';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, HighlightDirective, TitleCasePipe, TextFormatPipe],
  templateUrl: 'book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book!: Book;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private location: Location,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookService.getBookById(id).subscribe({
        next: (book: Book) => {
          this.book = book;
        },
        error: (err: any) => {
          console.error(err);
          this.notificationService.error(`Livre non trouvé: ${err.message || 'Erreur inconnue'}`);
          this.router.navigate(['/books']);
        }
      });
    }
  }

  updateRating(rating: number): void {
    this.bookService.updateBook({ ...this.book, rating }).subscribe({
      next: (updatedBook: Book) => {
        this.book = updatedBook;
        this.notificationService.success(`La note du livre "${updatedBook.title}" a été mise à jour`);
      },
      error: (err: any) => {
        console.error('Erreur lors de la mise à jour de la note:', err);
        this.notificationService.error(`Échec de la mise à jour de la note: ${err.message || 'Erreur inconnue'}`);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}