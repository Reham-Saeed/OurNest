import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  isEditing?: boolean;
}

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLinkActive, RouterLinkWithHref],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  newTask = '';

  tasks: Task[] = [{ id: 1, title: 'Task1', completed: false, isEditing: false }];

  addTask() {
    if (this.newTask.trim()) {
      this.tasks.push({
        id: Date.now(),
        title: this.newTask,
        completed: false,
      });
      this.newTask = '';
    }
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  toggleComplete(task: Task) {
    if (!task.isEditing) {
      task.completed = !task.completed;
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

    task.isEditing = false;
  }

  onEditEnter(task: Task) {
    this.saveEdit(task);
  }
}
