import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
}

@Injectable()
export class EmployeeService {
  private readonly employees = new Map<string, Employee>();

  create(data: Omit<Employee, 'id'>): Employee {
    const employee: Employee = { id: randomUUID(), ...data };
    this.employees.set(employee.id, employee);
    return employee;
  }

  findById(id: string): Employee | undefined {
    return this.employees.get(id);
  }

  findAll(): Employee[] {
    return [...this.employees.values()];
  }
}
