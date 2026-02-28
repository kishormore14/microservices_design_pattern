import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { EmployeeService, Employee } from './employee.service';
import { EmployeeEventsProducer } from './kafka/employee-events.producer';

class CreateEmployeeDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  department!: string;
}

@ApiTags('employees')
@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly producer: EmployeeEventsProducer
  ) {}

  @Post()
  @ApiCreatedResponse({ description: 'Employee created' })
  async create(@Body() dto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeService.create(dto);
    await this.producer.publishEmployeeCreated(employee);
    return employee;
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Employee found' })
  getById(@Param('id') id: string): Employee {
    const employee = this.employeeService.findById(id);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  @Get()
  @ApiOkResponse({ description: 'Employees list' })
  list(): Employee[] {
    return this.employeeService.findAll();
  }
}
