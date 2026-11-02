import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-policy-management',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './policy-management.html',
  styleUrl: './policy-management.css'
})
export class PolicyManagement {}