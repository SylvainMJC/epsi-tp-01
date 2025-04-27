import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { Router } from '@angular/router';
import { HighlightDirective } from '../../directives/highlight.directive';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { NotificationService } from '../../services/notification.service';
import { TitleCasePipe } from '../../pipes/title-case.pipe';
import { TextFormatPipe } from '../../pipes/text-format.pipe';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    FormsModule, 
    HighlightDirective, 
    TruncatePipe,
    TitleCasePipe,
    TextFormatPipe
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  searchTerm: string = '';

  constructor(
    private bookService: BookService,
    private router: Router,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    this.loadBooks();
  }
  
  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (books: Book[]) => {
        this.books = books;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des livres:', err);
        this.notificationService.error('Erreur lors du chargement des livres');
      }
    });
  }
  
  toggleFavorite(book: Book): void {
    this.bookService.toggleFavorite(book.id).subscribe({
      next: (updatedBook: Book) => {
        const index = this.books.findIndex(b => b.id === updatedBook.id);
        if (index !== -1) {
          this.books[index] = updatedBook;
          const status = updatedBook.isFavorite ? 'ajouté aux' : 'retiré des';
          this.notificationService.success(`"${updatedBook.title}" a été ${status} favoris`);
        }
      },
      error: (err: any) => {
        console.error('Erreur lors de la modification du favori:', err);
        this.notificationService.error(`La modification du favori a échoué: ${err.message || 'Erreur inconnue'}`);
      }
    });
  }
  
  deleteBook(id: string): void {
    const bookToDelete = this.books.find(b => b.id === id);
    if (!bookToDelete) return;
    
    const bookTitle = bookToDelete.title;
    
    this.bookService.deleteBook(id).subscribe({
      next: () => {
        this.books = this.books.filter(book => book.id !== id);
        this.notificationService.success(`"${bookTitle}" a été supprimé`);
      },
      error: (err: any) => {
        console.error('Erreur lors de la suppression du livre:', err);
        this.notificationService.error(`La suppression du livre a échoué: ${err.message || 'Erreur inconnue'}`);
      }
    });
  } 

  goToBookDetails(id: string): void {
    this.router.navigate(['/books', id]);
  }
}
