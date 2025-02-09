import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { EmployeeService } from '../service/employee.service';
import { HarvestedService } from '../service/harvested.service';
import { CreateEmployee } from '../dtos/create-employee.dto';
import { UpdateHarvestedDto } from '../dtos/update-harvested.dto';

@Controller('api/v1/employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly harvestedService: HarvestedService,
  ) {}

  @Get('get-employees/:startOfWeek')
  async getEmployees(@Param('startOfWeek') startOfWeek: string) {
    return await this.harvestedService.getCollectionsByWeek(startOfWeek);
  }

  @Post('create-employee')
  async createEmployee(@Body() createEmployee: CreateEmployee) {
    const employee = await this.employeeService.createEmployee(
      createEmployee.createEmployeeDto,
    );
    const harvested = await this.harvestedService.createHarvested(
      createEmployee.createHarvestedDto,
    );
    return { employee, harvested };
  }

  @Put('update-harvested')
  async updateHarvested(@Body() updateHarvestedDto: UpdateHarvestedDto) {
    return await this.harvestedService.updateHarvested(updateHarvestedDto);
  }
}
