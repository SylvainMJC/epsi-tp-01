import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Book } from '../models/book.model';
import { BOOKS } from '../mocks/books.mock';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor() {}
  
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  
  getBooks(): Observable<Book[]> {
    return of(BOOKS).pipe(delay(300));
  }
  
  getBookById(id: string): Observable<Book> {
    const book = BOOKS.find(b => b.id === id);
    
    if (!book) {
      return throwError(() => new Error('Livre non trouvé')).pipe(delay(300));
    }
    
    return of(book).pipe(delay(300));
  }
  
  addBook(book: Book): Observable<Book> {
    const newBookId = this.generateId();
    const newBook = {
      ...book,
      id: newBookId,
      createdAt: new Date().toISOString()
    };
    
    BOOKS.push(newBook);
    
    return of(newBook).pipe(delay(300));
  }
  
  updateBook(updatedBook: Book): Observable<Book> {
    const index = BOOKS.findIndex(b => b.id === updatedBook.id);
    
    if (index === -1) {
      return throwError(() => new Error('Livre non trouvé')).pipe(delay(300));
    }
    
    BOOKS[index] = { ...BOOKS[index], ...updatedBook };
    
    return of(BOOKS[index]).pipe(delay(300));
  }
  
  deleteBook(id: string): Observable<boolean> {
    const initialLength = BOOKS.length;
    const filteredBooks = BOOKS.filter(book => book.id !== id);
    
    // Update the array while keeping the same reference
    BOOKS.length = 0;
    BOOKS.push(...filteredBooks);
    
    return of(BOOKS.length !== initialLength).pipe(delay(300));
  }
  
  toggleFavorite(id: string): Observable<Book> {
    const book = BOOKS.find(book => book.id === id);
    
    if (!book) {
      return throwError(() => new Error('Livre non trouvé'));
    }
    
    const updatedBook = {
      ...book,
      isFavorite: !book.isFavorite
    };
    
    const index = BOOKS.findIndex(b => b.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Livre non trouvé')).pipe(delay(300));
    }
    
    BOOKS[index] = updatedBook;
    
    return of(updatedBook).pipe(delay(300));
  }
}