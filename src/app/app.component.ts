import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Task } from './task/task';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

var d = new Date();
d.setDate(d.getDate() - 1);

const todos: Task[] = [
  { title: 'Comprar leche', priority: 0, state: 0, created_at: new Date()},
  { title: 'Pasear al perro', priority: 1, state: 1, created_at: d},
  { title: 'Estudiar', priority: 0, state: 0, created_at: new Date()},
  { title: 'Sacar la basura', priority: 2, state: 0, created_at: d},
  { title: 'Limpiar la casa', priority: 2, state: 1, created_at: new Date()}
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {

  displayedColumns: string[] = ['title', 'priority', 'state', 'created_at'];

  dataSource = new MatTableDataSource(todos);

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

}