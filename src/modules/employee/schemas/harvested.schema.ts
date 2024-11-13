import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Harvested extends Document {
  @Prop({ type: Number, ref: 'Employee' })
  employeeId: number;

  @Prop({
    type: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
  })
  week: {
    start: Date;
    end: Date;
  };

  @Prop([
    {
      day: { type: String, required: true },
      date: { type: Date, required: true },
      coffeeAmount: { type: Number, required: true },
    },
  ])
  days: {
    day: string;
    date: Date;
    coffeeAmount: number;
  }[];
}

export const HarvestedSchema = SchemaFactory.createForClass(Harvested);
