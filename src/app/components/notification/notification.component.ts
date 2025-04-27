import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('notificationAnimation', [
      state('void', style({ 
        transform: 'translateY(-100%)',
        opacity: 0 
      })),
      state('visible', style({ 
        transform: 'translateY(0)',
        opacity: 1 
      })),
      transition('void => visible', animate('200ms ease-out')),
      transition('visible => void', animate('150ms ease-in'))
    ])
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription | null = null;
  
  constructor(private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe(notification => {
      this.notifications.push(notification);
      
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
  
  getIconClass(type: string): string {
    switch (type) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-times-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'info': return 'fa-info-circle';
      default: return 'fa-bell';
    }
  }
} 