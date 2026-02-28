import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from '../src/employee.service';

describe('EmployeeService', () => {
  let service: EmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeService]
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
  });

  it('creates an employee with id', () => {
    const employee = service.create({
      email: 'john.doe@corp.local',
      firstName: 'John',
      lastName: 'Doe',
      department: 'Platform'
    });

    expect(employee.id).toBeDefined();
    expect(employee.email).toBe('john.doe@corp.local');
  });
});
