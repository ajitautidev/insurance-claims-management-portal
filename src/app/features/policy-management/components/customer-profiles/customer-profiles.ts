import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../../../../core/models/customer.model';

@Component({
  selector: 'app-customer-profiles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-profiles.html',
  styleUrl: './customer-profiles.css'
})
export class CustomerProfiles implements OnInit {
  customers: Customer[] = [];
  searchText = '';

  // Temporary frontend demonstration data.
  // Replace this with the shared customer data source when available.
  ngOnInit(): void {
    this.customers = [
      {
        id: 1,
        fullName: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '9876543210',
        address: 'Pune, Maharashtra'
      },
      {
        id: 2,
        fullName: 'Priya Patil',
        email: 'priya@example.com',
        phone: '9876501234',
        address: 'Mumbai, Maharashtra'
      },
      {
        id: 3,
        fullName: 'Amit Deshmukh',
        email: 'amit@example.com',
        phone: '9876512340',
        address: 'Nashik, Maharashtra'
      }
    ];
  }

  get filteredCustomers(): Customer[] {
    const search = this.searchText.trim().toLowerCase();

    return this.customers.filter(customer =>
      String(customer.id).toLowerCase().includes(search) ||
      customer.fullName.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      customer.phone.toLowerCase().includes(search) ||
      customer.address.toLowerCase().includes(search)
    );
  }

  trackByCustomerId(index: number, customer: Customer): number {
    return customer.id;
  }
}