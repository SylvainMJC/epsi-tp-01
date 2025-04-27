import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { NotificationService } from '../../services/notification.service';
import { TextFormatPipe } from '../../pipes/text-format.pipe';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TextFormatPipe],
  templateUrl: 'add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  bookForm!: FormGroup;
  categories = ['fiction', 'science-fiction', 'policier', 'biographie', 'histoire', 'histoire_des_sciences', 'histoire_des_arts', 'poésie', 'roman', 'essai', 'essai_scientifique', 'essai_politique', 'essai_philosophique',  'informatique',  'autre'];
  submitted = false;
  
  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    this.bookForm = this.fb.group({
      title: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(100),
        this.noSpecialCharsValidator()
      ]],
      author: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(50),
        this.nameValidator()
      ]],
      description: ['', [
        Validators.required, 
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]],
      category: ['', Validators.required],
      rating: [0, [
        Validators.required, 
        this.ratingValidator()
      ]],
      isFavorite: [false]
    });
  }
  
  nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
      const valid = nameRegex.test(control.value);
      return valid ? null : { invalidName: true };
    };
  }
  
  noSpecialCharsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const specialCharsRegex = /^[a-zA-ZÀ-ÿ0-9\s\-:,.!?']+$/;
      const valid = specialCharsRegex.test(control.value);
      return valid ? null : { specialChars: true };
    };
  }
  
  ratingValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const rating = Number(control.value);
      if (isNaN(rating)) {
        return { invalidRating: true };
      }
      if (rating < 0 || rating > 5) {
        return { outOfRange: true };
      }
      return null;
    };
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      this.notificationService.error('Veuillez corriger les erreurs du formulaire avant de soumettre');
      return;
    }
    
    this.bookService.addBook(this.bookForm.value).subscribe({
      next: (newBook) => {
        this.notificationService.success(`"${newBook.title}" a été ajouté à votre bibliothèque`);
        this.router.navigate(['/books']);
      },
      error: (err: any) => {
        console.error('Erreur lors de l\'ajout du livre', err);
        this.notificationService.error(`Échec de l'ajout du livre: ${err.message || 'Erreur inconnue'}`);
      }
    });
  }
}