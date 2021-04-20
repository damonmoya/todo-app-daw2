import { Component, ViewChild, OnInit  } from '@angular/core';
import { Task } from './task/task';
import { MatTable } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { TaskDialogComponent, TaskDialogResult } from './task-dialog/task-dialog.component';
import { AngularFirestore } from '@angular/fire/firestore';

var d = new Date();
d.setDate(d.getDate() - 1);

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
    this.dataSource_finished = new MatTableDataSource();
  }

  displayedColumns: string[] = ['title', 'priority', 'state', 'created_at', 'action'];
  displayedColumns_done: string[] = ['title', 'priority', 'state', 'created_at'];

  @ViewChild(MatTable, { static: true })
  table!: MatTable<any>;

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  ngOnInit() {
    this.refreshTable()
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
      this.refreshTable();
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
      .subscribe((result: TaskDialogResult) => 
        this.store.collection('todos').add(result.task));
  }

  done(task: Task): void {
    task.state = 2;
    this.store.collection('todos').doc(task.id).update(task);
    this.store.collection('todos').doc(task.id).delete();
    this.store.collection('done_todos').add(task);
    this.refreshTable();
  }

  refreshTable() {
    this.todos.subscribe((task: any)=> {
      ​​​​​this.dataSource = new MatTableDataSource(task);
      this.dataSource.sort = this.sort;
    })
    this.done_todos.subscribe((task: any)=> {
      ​​​​​this.dataSource_finished = new MatTableDataSource(task);
      this.dataSource_finished.sort = this.sort;
    })
  }

}