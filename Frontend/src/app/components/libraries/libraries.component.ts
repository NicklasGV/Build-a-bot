import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-libraries',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './libraries.component.html',
  styleUrl: './libraries.component.scss'
})
export class LibrariesComponent {

}
