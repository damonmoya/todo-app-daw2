import { Component, ViewChild, OnInit  } from '@angular/core';
import { Task } from './task/task';
import { MatTable } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { TaskDialogComponent, TaskDialogResult } from './task-dialog/task-dialog.component';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  todos = this.store.collection('todos').valueChanges({ idField: 'id' });
  done_todos = this.store.collection('done_todos').valueChanges({ idField: 'id' });
  dataSource: any;
  dataSource_finished: any;

  constructor(private dialog: MatDialog, private store: AngularFirestore) {
    this.dataSource = new MatTableDataSource();
    this.todos.subscribe((task: any)=> {
      ​​​​​this.dataSource = new MatTableDataSource(task);
      this.dataSource.sort = this.sorter1;
    })
    this.dataSource_finished = new MatTableDataSource();
    this.done_todos.subscribe((task: any)=> {
      ​​​​​this.dataSource_finished = new MatTableDataSource(task);
      this.dataSource_finished.sort = this.sorter2;
    })
  }

  displayedColumns: string[] = ['title', 'priority', 'state', 'created_at', 'action'];

  @ViewChild(MatTable, { static: true })
  table!: MatTable<any>;

  @ViewChild('sorter1')
  sorter1: MatSort = new MatSort;

  @ViewChild('sorter2')
  sorter2: MatSort = new MatSort;

  ngOnInit() {
    this.refreshTodoTable()
    this.refreshDoneTable()
  }

  delete(task: Task, list: string): void {
    this.store.collection(list).doc(task.id).delete();
  }

  edit(task: Task, list: string): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      disableClose: true,
      width: '270px',
      data: {
        task,
        editing: true
      }
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
      if (!result.cancel) {
        this.store.collection(list).doc(task.id).update(task);
      }  
      this.refreshTodoTable();
    })
  }

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      disableClose: true,
      width: '270px',
      data: {
        task: { title: '', priority: 0, state: 0, created_at: new Date()}
      }
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult) => {
        result.task.created_at = new Date();
        this.store.collection('todos').add(result.task);
      })
  }

  done(task: Task): void {
    task.state = 2;
    this.store.collection('todos').doc(task.id).update(task);
    this.store.collection('todos').doc(task.id).delete();
    this.store.collection('done_todos').add(task);
  }

  restore(task: Task): void {
    task.state = 1;
    this.store.collection('done_todos').doc(task.id).update(task);
    this.store.collection('done_todos').doc(task.id).delete();
    this.store.collection('todos').add(task);
  }

  refreshTodoTable() {
    this.todos.subscribe((task: any)=> {
      ​​​​​this.dataSource = new MatTableDataSource(task);
      this.dataSource.sort = this.sorter1;
    })
  }

  refreshDoneTable() {
    this.done_todos.subscribe((task: any)=> {
      ​​​​​this.dataSource_finished = new MatTableDataSource(task);
      this.dataSource_finished.sort = this.sorter2;
    })
  }

}