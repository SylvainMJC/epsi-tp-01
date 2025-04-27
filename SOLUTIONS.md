Nom : Conan Sylvain
Classe : C1
Formation : B3 DEVIA FullStack
École : EPSI

# Solutions aux problèmes - BiblioTech

Ce document présente les solutions mise en place pour corriger les différents bugs et problèmes de l'application BiblioTech.

## Problème #1: Navigation incorrecte

Les liens utilisaient `href` au lieu de `routerLink`, causant un rechargement complet de la page à chaque navigation. Pour résoudre ce problème, j'ai remplacé tous les attributs `href` par `routerLink` dans les éléments de navigation, permettant ainsi une navigation sans rechargement de page grâce à la directive RouterLink d'Angular, essentielle pour le fonctionnement d'une application monopage.

```html
<!-- Avant -->
<a href="/books">Ma Bibliothèque</a>

<!-- Après -->
<a routerLink="/books">Ma Bibliothèque</a>
```

Dans la barre de navigation, tous les liens ont été modifiés pour utiliser routerLink:

```html
<nav>
  <ul>
    <li>
      <a routerLink="/">Accueil</a>
    </li>
    <li>
      <a routerLink="/books">Ma Bibliothèque</a>
    </li>
  </ul>
</nav>
```

## Problème #2: Besoin de formatage de texte

Les catégories de livres s'affichaient avec des traits de soulignement et sans majuscule (comme "histoire_des_sciences", que j'ai rajouté dans un select), rendant la présentation peu professionnelle. J'ai créé un pipe personnalisé `TextFormatPipe` qui transforme le texte en remplaçant les traits de soulignement par des espaces et en mettant en majuscule la première lettre, utilisant ainsi le concept de pipes personnalisés d'Angular pour transformer efficacement les données affichées dans les templates.

Pour les options du formulaire d'ajout de livre, j'ai utilisé un menu déroulant (`select`) plutôt qu'un champ texte, ce qui garantit que l'utilisateur ne peut sélectionner que des catégories valides, tout en appliquant le formatage approprié à l'affichage des options.

```typescript
@Pipe({
  name: 'textFormat',
  standalone: true
})
export class TextFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Remplace les traits de soulignement par des espaces
    const withSpaces = value.replace(/_/g, ' ');
    
    // Met en majuscule le premier mot
    const words = withSpaces.split(' ');
    
    if (words.length === 0) return '';
    
    // Convertit le premier mot avec sa première lettre en majuscule
    const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
    
    // Convertit le reste en minuscules
    const restWords = words.slice(1).map(word => word.toLowerCase());
    
    // Regroupe tous les mots
    return [firstWord, ...restWords].join(' ');
  }
}
```

Application du pipe dans les templates:

```html
<!-- Dans le formulaire d'ajout -->
<select id="category" formControlName="category">
  <option *ngFor="let category of categories" [value]="category">
    {{category | textFormat}}
  </option>
</select>

<!-- Dans la liste des livres -->
<p>Catégorie: {{ book.category | textFormat }}</p>

<!-- Dans la page de détail -->
<div class="info-item">
  <strong>Catégorie</strong>
  {{ book.category | textFormat }}
</div>
```

Cette solution assure un affichage cohérent et professionnel des catégories dans toute l'application, même pour des valeurs comme "histoire_des_sciences" qui sont maintenant affichées comme "Histoire des sciences".

## Problème #3: Structure de page incomplète

L'application manquait de modularité avec des éléments répétés comme le header et le footer, ce qui rendait la maintenance difficile. Pour résoudre ce problème, j'ai créé des composants réutilisables pour le header et le footer, améliorant ainsi l'architecture par composants d'Angular pour faciliter la réutilisation de code et la séparation des responsabilités dans l'application.

Exemple du composant de header:

```typescript
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
```

Template du composant:

```html
<header class="header">
  <h1>
    <a routerLink="/">
      <span>{{title | textFormat}}</span>
    </a>
  </h1>
  <nav>
    <ul>
      <li>
        <a routerLink="/">Accueil</a>
      </li>
      <li>
        <a routerLink="/books">Ma Bibliothèque</a>
      </li>
    </ul>
  </nav>
</header>
```

Utilisation dans le composant principal:

```html
<app-header [title]="title"></app-header>

<main class="main-content">
  <router-outlet></router-outlet>
</main>

<app-footer></app-footer>
```

## Problème #4: Pages non affichées

Le routeur était mal configuré et la balise `<router-outlet>` manquait, empêchant l'affichage correct des pages dans l'application. J'ai résolu ce problème en vérifiant la configuration des routes et en ajoutant la directive `<router-outlet>` dans le fichier app.component.html, utilisant ainsi les fonctionnalités de routing d'Angular pour permettre l'affichage dynamique des composants selon la route active.

Dans le template principal, nous avons vérifié et ajouté:

```html
<main class="main-content">
  <router-outlet></router-outlet>
</main>
```

## Problème #5: Route manquante

La route pour la page détail d'un livre n'était pas correctement définie, empêchant l'accès aux détails des livres. J'ai ajouté une route paramétrée pour les détails d'un livre dans app.routes.ts, utilisant le concept de routes paramétrés d'Angular pour permettre la récupération des paramètres avec le service ActivatedRoute et afficher les données correspondantes.

```typescript
const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'books', component: BookListComponent },
  { path: 'books/add', component: AddBookComponent },
  { path: 'books/:id', component: BookDetailComponent },
  { path: '**', redirectTo: '' }
];
```

Dans le composant de détail, nous récupérons l'identifiant du livre depuis la route:

```typescript
ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.bookService.getBookById(id).subscribe({
      next: (book: Book) => {
        this.book = book;
      },
      error: (err: any) => {
        console.error(err);
        this.router.navigate(['/books']);
      }
    });
  }
}
```

## Problème #6: Formulaire incomplet

Le formulaire d'ajout de livre n'était pas implémenté correctement, rendant impossible l'ajout de nouveaux livres. J'ai créé un formulaire réactif complet avec tous les champs nécessaires, utilisant les concepts de formulaires réactifs d'Angular avec FormBuilder, FormGroup et FormControl pour structurer et contrôler les saisies utilisateur.

```typescript
ngOnInit(): void {
  this.bookForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    author: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    category: ['', Validators.required],
    rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    isFavorite: [false]
  });
}
```

Le template du formulaire:

```html
<form [formGroup]="bookForm" (ngSubmit)="onSubmit()">
  <div class="form-group">
    <label for="title">Titre du livre*</label>
    <input type="text" id="title" formControlName="title" placeholder="Titre du livre">
    <div class="error-message" *ngIf="bookForm.get('title')?.invalid && bookForm.get('title')?.touched">
      <span *ngIf="bookForm.get('title')?.errors?.['required']">Le titre est requis</span>
      <span *ngIf="bookForm.get('title')?.errors?.['minlength']">Le titre doit contenir au moins 3 caractères</span>
    </div>
  </div>
  
  <!-- Autres champs du formulaire... -->
  
  <button type="submit" [disabled]="bookForm.invalid">Ajouter le livre</button>
</form>
```

## Problème #7: Validations manquantes

Le formulaire acceptait des données invalides sans validation, compromettant l'intégrité des données. J'ai ajouté des validations avancées et messages d'erreur personnalisés, en utilisant les validators intégrés et personnalisés d'Angular ainsi que l'affichage conditionnel des erreurs pour guider l'utilisateur et garantir la qualité des données saisies.

Exemples de validators personnalisés:

```typescript
// Validateur personnalisé pour les noms
nameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
    const valid = nameRegex.test(control.value);
    return valid ? null : { invalidName: true };
  };
}

// Validateur personnalisé pour éviter les caractères spéciaux
noSpecialCharsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const specialCharsRegex = /^[a-zA-ZÀ-ÿ0-9\s\-:,.!?']+$/;
    const valid = specialCharsRegex.test(control.value);
    return valid ? null : { specialChars: true };
  };
}
```

Utilisation des validators personnalisés:

```typescript
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
]]
```

## Problème #8: Navigation manquante

Il était impossible de revenir à la page précédente depuis certaines vues, dégradant l'expérience utilisateur. J'ai implémenté des button de retour utilisant Location.back() et la navigation programmatique, exploitant les services Location et Router d'Angular pour permettre une navigation fluide et intuitive dans l'application.

```typescript
constructor(
  private route: ActivatedRoute,
  private router: Router,
  private bookService: BookService,
  private location: Location
) {}

goBack(): void {
  this.location.back();
}
```

Template avec bouton de retour:

```html
<div class="button-container">
  <button class="back-button" (click)="goBack()">
    <i class="fas fa-arrow-left"></i> Retour
  </button>
</div>
```

## Problème #9: Erreur dans la console

Des erreurs "Cannot read properties of undefined" apparaissaient dans la console car le code tentait d'accéder à des propriétés d'objets non encore chargés. J'ai ajouté des gardes avec la directive structurelle *ngIf pour n'afficher les éléments que lorsque les données sont disponibles, appliquant ainsi les bonnes pratiques de gestion des données asynchrones et de cycle de vie des composants dans Angular.

```html
<div class="book-detail-container">
  <div class="book-card" *ngIf="book; else loading">
    <h1 class="book-title">{{ book.title }}</h1>
    
    <div class="book-info">
      <p class="author">{{ book.author }}</p>
      <p class="description">{{ book.description }}</p>
      
      <!-- Autres détails du livre... -->
    </div>
  </div>
  
  <ng-template #loading>
    <div class="loading">Chargement du livre...</div>
  </ng-template>
</div>
```

## Problème #10: Directive non appliquée

La directive highlight n'était pas appliquée aux éléments appropriés, privant l'interface de mises en valeur visuelles importantes. J'ai implémenté complètement la directive highlight et l'ai appliquée aux titres des livres, utilisant les directives d'attribut personnalisées d'Angular et le service Renderer2 pour manipuler le DOM de manière sécurisé et efficace.

```typescript
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
```

Application de la directive dans les templates:

```html
<h1 class="book-title" [appHighlight]="true">{{ book.title | titleCase }}</h1>
```

## Problème #11: Bouton non fonctionnel

Certains boutons ne réagissaient pas aux clics, rendant certaines fonctionnalités inaccessibles. J'ai implémenté correctement les gestionnaires d'événements pour chaque button, utilisant la liaison d'événements d'Angular pour connecter les actions utilisateur aux méthodes du composant correspondantes.

```html
<button (click)="toggleFavorite(book)">
  {{ book.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
</button>
```

Implémentation de la méthode dans le composant:

```typescript
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
```

## Problème #12: Données non affichées

Les données étaient chargées mais n'apparaissaient pas dans l'interface, laissant les utilisateurs sans accès aux informations. J'ai corrigée la liaison de données dans les templates et assuré la synchronisation avec le modèle de données, utilisant efficacement les mécanismes de binding de données et la directive ngFor d'Angular pour afficher dynamiquement les collections d'éléments.

```typescript
loadBooks(): void {
  this.bookService.getBooks().subscribe({
    next: (books: Book[]) => {
      this.books = books;
      this.data = books; 
    },
    error: (err: any) => {
      console.error('Erreur lors du chargement des livres:', err);
      this.notificationService.error('Erreur lors du chargement des livres');
    }
  });
}
```

Affichage dans le template:

```html
<div *ngIf="books && books.length > 0; else noBooks">
  <div class="book-card" *ngFor="let book of books">
    <div class="book-info">
      <h2>{{ book.title }}</h2>
      <p>{{ book.author }}</p>
      <p>{{ book.description }}</p>
      <!-- Autres détails du livre... -->
    </div>
  </div>
</div>

<ng-template #noBooks>
  <div class="no-books-message">
    <p>Aucun livre dans votre bibliothèque.</p>
    <button class="add-button" routerLink="/books/add">Ajouter mon premier livre</button>
  </div>
</ng-template>
```

## Problème #13: Descriptions trop longues

Les descriptions des livres prenaient trop de place dans l'interface, rendant la navigation et la lecture difficiles. J'ai créé un pipe "truncate" limitant le texte à une longueur donnée avec ajout de points de suspension, utilisant les pipes personnalisés d'Angular pour transformer et présenter les données de manière optimale selon le contexte d'affichage.

```typescript
@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 20, ellipsis: string = '...'): string {
    if (!value) return '';
    
    // Si le texte est plus court que la limite, retourner le texte original
    if (value.length <= limit) return value;
    
    // Sinon, tronquer le texte et ajouter des points de suspension
    return value.slice(0, limit) + ellipsis;
  }
}
```

Utilisation dans le template:

```html
<p>{{ book.description | truncate:50 }}</p>
```

## Problème #14: Retour utilisateur manquant

Aucune confirmation n'était affichée après les actions des utilisateurs, créant confusion et incertitude. J'ai développé un service de notification complet pour informer l'utilisateur des résultats d'opérations, en utilisant les services, les Observables et le Subject de RxJS pour établir une communication efficace entre les différents composants de l'application.

Le service de notification:

```typescript
export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  
  notification$ = this.notificationSubject.asObservable();
  
  success(message: string, duration: number = 3000): void {
    this.show({ message, type: 'success', duration });
  }
  
  error(message: string, duration: number = 5000): void {
    this.show({ message, type: 'error', duration });
  }
  
  info(message: string, duration: number = 3000): void {
    this.show({ message, type: 'info', duration });
  }
  
  warning(message: string, duration: number = 4000): void {
    this.show({ message, type: 'warning', duration });
  }
  
  private show(notification: Notification): void {
    this.notificationSubject.next(notification);
  }
}
```

Le composant de notification:

```typescript
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription | null = null;
  
  constructor(private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe(notification => {
      this.notifications.push(notification);
      
      // Auto-suppression après la durée spécifiée
      setTimeout(() => {
        this.removeNotification(notification);
      }, notification.duration || 3000);
    });
  }
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  removeNotification(notification: Notification): void {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }
}
```

Utilisation dans les composants:

```typescript
this.notificationService.success(`"${updatedBook.title}" a été ajouté aux favoris`);
```

## Problème #15: Erreur d'affichage du titre

Les titres ne s'affichaient pas correctement avec une casse incohérente, nuisant à la cohérence visuelle et à la lisibilité. J'ai créé un pipe TitleCase personnalisé pour formater correctement les titres de livres, exploitant les pipes personnalisés d'Angular pour transformer les données textuelles selon des règles typographiques professionnelles dans les templates.

```typescript
@Pipe({
  name: 'titleCase',
  standalone: true
})
export class TitleCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Liste des mots courts qui ne doivent pas être capitalisés sauf s'ils sont le premier mot
    const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
    
    // Diviser la chaîne en mots
    return value.toLowerCase()
      .split(/\s+/)
      .map((word, index) => {
        // Toujours mettre en majuscule le premier mot, les noms propres, 
        // ou si le mot ne correspond pas à notre règle smallWords
        if (index === 0 || !smallWords.test(word)) {
          // Mettre en majuscule la première lettre
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      })
      .join(' ');
  }
}
```

Utilisation dans les templates:

```html
<h1 class="book-title">{{ book.title | titleCase }}</h1>
```

## Fonctionnalités additionnelles implémentées

### Système de notification avancé

J'ai créé un système de notification complet qui affiche des messages temporaires dans le coin supérieur droit de l'écran. Ces notifications disparaissent automatiquement après quelques secondes ou peuvent être fermées manuellement. Voici un exemple de son utilisation:

```typescript
// Après une action réussie
this.notificationService.success('Le livre a été ajouté avec succès');

// En cas d'erreur
this.notificationService.error('Impossible de charger les données du livre');

// Pour une information
this.notificationService.info('Chargement des livres en cours...');

// Pour un avertissement
this.notificationService.warning('Certains champs sont incomplets');
```

Chaque type de notification a son propre style visuel, ce qui aide l'utilisateur à comprendre rapidement la nature du message.

### Amélioration de l'expérience utilisateur

J'ai ajouté des états de chargement pour indiquer quand une opération est en cours. Par exemple, pendant le chargement d'un livre:

```html
<div *ngIf="book; else loading">
  <!-- Contenu du livre -->
</div>

<ng-template #loading>
  <div class="loading">Chargement du livre en cours...</div>
</ng-template>
```

J'ai également amélioré les messages d'erreur de validation du formulaire pour qu'ils soient plus spécifiques et utiles:

```html
<div class="error-message" *ngIf="bookForm.get('title')?.invalid && bookForm.get('title')?.touched">
  <span *ngIf="bookForm.get('title')?.errors?.['required']">Le titre est obligatoire</span>
  <span *ngIf="bookForm.get('title')?.errors?.['minlength']">Le titre doit contenir au moins 3 caractères</span>
  <span *ngIf="bookForm.get('title')?.errors?.['maxlength']">Le titre ne peut pas dépasser 100 caractères</span>
  <span *ngIf="bookForm.get('title')?.errors?.['specialChars']">Le titre contient des caractères non autorisés</span>
</div>
```

### Meilleure gestion des erreurs

J'ai implémenté une gestion globale des erreurs qui capture les problèmes dans les appels de service et affiche des messages appropriés:

```typescript
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
```

En cas d'erreur critique, l'utilisateur est redirigé vers une page sûre et reçoit une notification claire sur ce qui s'est passé.

### Adaptation aux différentes tailles d'écran

Le design s'adapte aux différentes tailles d'écran. Sur les grands écrans, les détails sont affichés dans une disposition horizontale, tandis que sur les écrans mobiles, ils sont réorganisés verticalement:

```css
@media (max-width: 768px) {
  .book-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .book-info {
    margin-bottom: 1rem;
  }
  
  .book-actions {
    width: 100%;
    flex-direction: row;
  }
}
``` 