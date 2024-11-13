import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({})
export class Employee extends Document {
  @Prop({ type: Number, required: true })
  employeeId: number;
  @Prop({ type: String, required: true })
  firstName: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({ type: String })
  email: string;
  @Prop({ type: String, required: true })
  phone: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
