import { Module } from '@nestjs/common';
import { EmployeeController } from './cotrollers/employee.controller';
import { EmployeeService } from './service/employee.service';
import { Employee, EmployeeSchema } from './schemas/employee.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HarvestedService } from './service/harvested.service';
import { Harvested, HarvestedSchema } from './schemas/harvested.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: Harvested.name, schema: HarvestedSchema },
    ]),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, HarvestedService],
})
export class EmployeeModule {}
