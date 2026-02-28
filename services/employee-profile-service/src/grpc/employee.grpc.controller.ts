import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { EmployeeService } from '../employee.service';

interface GetEmployeeRequest {
  id: string;
}

interface EmployeeResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
}

@Controller()
export class EmployeeGrpcController {
  constructor(private readonly employeeService: EmployeeService) {}

  @GrpcMethod('EmployeeService', 'GetEmployee')
  getEmployee(data: GetEmployeeRequest): EmployeeResponse {
    const employee = this.employeeService.findById(data.id);
    if (!employee) {
      return {
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        department: ''
      };
    }
    return employee;
  }
}
