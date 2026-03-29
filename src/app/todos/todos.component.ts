import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { OAuthService } from 'angular-oauth2-oidc';
// Interfaces
interface Todo {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  addedOn: Date;
  editedOn: Date;
}

interface PaginatedResponse {
  todos: Todo[];
  totalCount: number;
}

@Component({
  selector: 'app-todos',
  providers: [MessageService],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ToastModule, ButtonModule, AvatarModule],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  constructor(private messageService: MessageService, private httpClient: HttpClient,private oauthService : OAuthService) {
  }
  baseUrl: string = '';
  visible = false;
  // private messageService = inject(MessageService);

  getBaseUrl() {
    this.httpClient.get('/assets/web-api-config.json').subscribe((res: any) => {
      this.baseUrl = res.webApiUrl;
      console.log(this.baseUrl);
      this.loadData(); // config load hone ke baad hi API call
    });
  }

  // State Signals
  todos = signal<Todo[]>([]);
  totalCount = signal(0);
  isLoading = signal(false);

  // Pagination Signals
  currentPage = signal(1);
  itemsPerPage = 5;

  // Modal Signals
  showModal = signal(false);
  isEditing = signal(false);
  currentTodoId: number = 0;
  currentTodo: Partial<Todo> = { title: '', description: '', isCompleted: false };

  ngOnInit() {
    this.getBaseUrl();
  }

  // --- Core Data Loading ---
  loadData() {
    this.isLoading.set(true);
    const url = `${this.baseUrl}/todos/paginated?pageNumber=${this.currentPage()}&pageSize=${this.itemsPerPage}`;

    this.httpClient.get<PaginatedResponse>(url).subscribe({
      next: (response) => {
        this.todos.set(response.todos);
        this.totalCount.set(response.totalCount);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Fetch error', err);
        this.isLoading.set(false);
      }
    });
  }

  // --- Pagination Logic ---
  // Fix: Since the server gives us exactly 5 items, we just return them.
  // No need to slice again on the client side.
  paginatedTodos = computed(() => this.todos());

  totalPages = computed(() => Math.ceil(this.totalCount() / this.itemsPerPage));

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadData(); // CRITICAL: Must re-fetch data when page changes
    }
  }

  // Helper for generating page numbers [1, 2, ..., 10]
  get visiblePages(): (number | string)[] {
    const total = this.totalPages();
    const current = this.currentPage();

    // Simple logic for small page counts
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    // Complex logic for many pages (adds "...")
    const pages: (number | string)[] = [1];
    if (current > 4) pages.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 3) pages.push('...');
    if (total > 1) pages.push(total);

    return pages;
  }

  // --- CRUD Operations ---

  openModal(todo?: Todo) {
    this.isEditing.set(!!todo);
    this.currentTodo = todo ? { ...todo } : { title: '', description: '', isCompleted: false };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveTodo() {
    if (!this.currentTodo.title?.trim()) return;
    this.isLoading.set(true);

    if (this.isEditing() && this.currentTodo.id) {
      // Update
      this.httpClient.put(`${this.baseUrl}/todos/${this.currentTodo.id}`, this.currentTodo)
        .subscribe(() => {
          this.showToast('success', 'Success', 'Todo updated successfully.');
          this.loadData(); // Refresh current page
          this.closeModal();
        });
    } else {
      // Create
      this.httpClient.post(`${this.baseUrl}/todos`, this.currentTodo)
        .subscribe(() => {
          this.showToast('success', 'Success', 'Todo created successfully.');
          this.currentPage.set(1); // Go to first page on new add
          this.loadData();
          this.closeModal();
        });
    }
  }
  deleteTodo(id: number) {
    this.currentTodoId = id;
    console.log("this.currentTodoId");
    this.showConfirm();
  }

  // showToast(){
  // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Todo deleted successfully.' });

  // }
  // HTML Helper
  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }


  showConfirm() {
    if (!this.visible) {
      this.messageService.add({
        key: 'confirm',
        sticky: true,
        severity: 'custom',
        summary: 'Are sure to delete this todo?',
        styleClass: 'custom-toast-bg' 
      });
      this.visible = true;
    }
  }


  onReject() {
    this.messageService.clear('confirm');
    this.visible = false;
  }
  onConfirm() {
    this.httpClient.delete(`${this.baseUrl}/todos/${this.currentTodoId}`)
      .subscribe(() => {
        this.showToast('success', 'Success', 'Todo deleted successfully.');
        this.loadData();
        this.visible = false;
        this.messageService.clear('confirm');
      });
  }
  asNumber(val: any): number { return Number(val); }
  get userName(): string {
  if (this.oauthService.hasValidIdToken()) {
    const claims = this.oauthService.getIdentityClaims() as any;
    return claims['name'] || claims['preferred_username'] || 'User';
  }
  return 'Guest';
}

get userInitials(): string {
  const name = this.userName;
  if (name === 'Guest') return 'G';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}
}


