import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersistencesModule } from './modules/persistences/persistences.module';
import { EmployeeModule } from './modules/employee/employee.module';

@Module({
  imports: [PersistencesModule, EmployeeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
