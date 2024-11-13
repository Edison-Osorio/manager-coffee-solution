import { CreateHarvestedDto } from './create-harvested.dto';

export class CreateEmployeeDto {
  readonly empleadoId: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly password: string;
}

export interface CreateEmployee {
  createEmployeeDto: CreateEmployeeDto;
  createHarvestedDto: CreateHarvestedDto;
}
