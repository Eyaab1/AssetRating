import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-contributer-layout',
  standalone: true,
  imports: [SidebarComponent,RouterOutlet],
  templateUrl: './contributer-layout.component.html',
  styleUrl: './contributer-layout.component.css'
})
export class ContributerLayoutComponent {

}
