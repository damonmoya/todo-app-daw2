import { AfterViewInit, Component, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { Task } from './task/task';
import { MatTable } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { TaskDialogComponent, TaskDialogResult } from './task-dialog/task-dialog.component';

var d = new Date();
d.setDate(d.getDate() - 1);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {

  constructor(private dialog: MatDialog) {}

  todos: Task[] = [
    { title: 'Comprar leche', priority: "Baja", state: 0, created_at: new Date()},
    { title: 'Pasear al perro', priority: "Media", state: 1, created_at: d},
    { title: 'Estudiar', priority: "Baja", state: 0, created_at: new Date()},
    { title: 'Sacar la basura', priority: "Alta", state: 0, created_at: d},
    { title: 'Limpiar la casa', priority: "Alta", state: 1, created_at: new Date()}
  ];

  displayedColumns: string[] = ['title', 'priority', 'state', 'created_at', 'action'];

  dataSource = new MatTableDataSource(this.todos);

  @ViewChild(MatTable, { static: true })
  table!: MatTable<any>;

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  delete(task: Task): void {
    const taskIndex = this.todos.indexOf(task);
    this.todos.splice(taskIndex, 1);
    this.refreshTable();
  }

  edit(task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true
      }
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
      const taskIndex = this.todos.indexOf(task);
      if (result.delete) {
        this.todos.splice(taskIndex, 1);
      } else {
        this.todos[taskIndex] = task;
      }
    })
    dialogRef
      .afterClosed()
      .subscribe(() => this.refreshTable());
  }

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: { title: '', priority: "Baja", state: 0, created_at: new Date()}
      }
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult) => 
        this.todos.push({ title: result.task.title, priority: result.task.priority, state: 0, created_at: new Date() }));
    dialogRef
      .afterClosed()
      .subscribe(() => this.refreshTable());
  }

  refreshTable() {
    this.dataSource = new MatTableDataSource(this.todos);
    this.dataSource.sort = this.sort;
  }

}