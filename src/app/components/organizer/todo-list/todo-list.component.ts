import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { Task, TodoService } from '../../../core/services/Organizer/todo.service';
import { AiService } from '../../../core/services/AI/ai.service';
import { AppStateService } from '../../../core/services/app-state/app-state.service';
import { PartnerService } from '../../../core/services/partner/partner.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLinkActive, RouterLinkWithHref],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit {
  private todoService = inject(TodoService);
  private _AppStateService = inject(AppStateService);
  private _PartnerService = inject(PartnerService);

  appState: any = null;
  currentUserRole: string = '';

  newTask = '';
  tasks: Task[] = [];
  partnerTasks: any[] = [];

  ngOnInit() {
    this.appState = this._AppStateService.getLocalState();
    this.currentUserRole = this.appState?.role;

    this.loadTasks();
  }

  loadTasks() {
    this.todoService.getTodos().subscribe({
      next: (data) => (this.tasks = data),
      error: (err) => console.error('Failed to load tasks', err),
    });
    this._PartnerService.getFamilyDashboard().subscribe((res: any) => {
      const role = this.currentUserRole;

      this.partnerTasks = res.todos.filter((t: any) => t.assignedByRole != role);
    });
  }

  addTask() {
    if (this.newTask.trim()) {
      const payload = {
        title: this.newTask,
        description: '',
        priority: 0,
        category: 'General',
        dueDate: new Date().toISOString(),
      };

      this.todoService.addTodo(payload).subscribe({
        next: (createdTask) => {
          this.tasks.push(createdTask);
          this.newTask = '';
        },
        error: (err) => console.error('Failed to add task', err),
      });
    }
  }

  deleteTask(id: string) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((t) => t.id !== id);
      },
      error: (err) => console.error('Failed to delete task', err),
    });
  }

  toggleComplete(task: Task) {
    if (!task.isEditing) {
      task.isCompleted = !task.isCompleted;

      this.todoService.toggleComplete(task.id).subscribe({
        error: (err) => {
          task.isCompleted = !task.isCompleted;
          console.error('Failed to toggle task', err);
        },
      });
    }
  }

  toggleShare(task: any) {
    const newValue = !task.sharedWithPartner;

    this.todoService.shareTodo(task.id, { sharedWithPartner: newValue }).subscribe({
      next: (res) => {
        task.sharedWithPartner = newValue;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  startEdit(task: Task) {
    task.isEditing = true;
  }

  saveEdit(task: Task) {
    if (!task.title.trim()) {
      this.deleteTask(task.id);
      return;
    }

    const payload = {
      task: task.title,
      isDone: task.isCompleted,
    };

    this.todoService.updateTodo(task.id, payload).subscribe({
      next: () => {
        task.isEditing = false;
      },
      error: (err) => {
        console.error('Failed to update task', err);
      },
    });
  }

  onEditEnter(task: Task) {
    this.saveEdit(task);
  }
}
