import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { Task, TodoService } from '../../../core/services/Organizer/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLinkActive, RouterLinkWithHref],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit {
  private todoService = inject(TodoService);

  newTask = '';
  tasks: Task[] = [];

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.todoService.getTodos().subscribe({
      next: (data) => (this.tasks = data),
      error: (err) => console.error('Failed to load tasks', err),
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
