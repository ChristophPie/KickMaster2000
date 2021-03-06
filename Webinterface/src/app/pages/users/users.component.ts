import { UserServiceService } from './../../services/user-service.service';
import { ModifyUserComponent } from './../../dialogs/modify-user/modify-user.component';
import { environment } from './../../../environments/environment';
import { User } from './../../entities/user';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['image', 'name', 'audio', 'edit', 'delete'];

  dataSource;

  apiUrl = environment.apiUrl;

  constructor(
    public dialog: MatDialog,
    public userService: UserServiceService,
    public cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<User>();
  }

  ngOnInit() {
    this.userService.getAll().subscribe( (res) => {
      this.dataSource.data = res;
    }, (err) => {
      console.log(err);
    });
  }

  openModifyUserPopup(user?: User) {
    const dialogRef = this.dialog.open(ModifyUserComponent, {
      width: '650px',
      data: user
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (user) {
          user = result;
          this.dataSource = new MatTableDataSource(this.dataSource.data);
        } else {
          this.dataSource.data.push(result);
          this.dataSource = new MatTableDataSource(this.dataSource.data);
        }
      }
    });
  }

  deleteUser(user: User) {
    if(window.confirm('Sind Sie sicher, dass Sie den Spieler ' + user.name + ' löschen möchten?')) {
      this.userService.delete(user).subscribe( (res) => {
        this.dataSource.data.splice(this.dataSource.data.indexOf(user), 1);
        this.dataSource = new MatTableDataSource(this.dataSource.data);
      }, (err) => {
        console.log('error');
      });
    }
  }
}
