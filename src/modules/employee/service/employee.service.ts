import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employee } from '../schemas/employee.schema';
import { Model } from 'mongoose';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
  ) {}

  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    return await this.employeeModel.create(createEmployeeDto);
  }
}
