import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Harvested } from '../schemas/harvested.schema';
import { CreateHarvestedDto } from '../dtos/create-harvested.dto';
import { Model } from 'mongoose';
import { UpdateHarvestedDto } from '../dtos/update-harvested.dto';

@Injectable()
export class HarvestedService {
  constructor(
    @InjectModel(Harvested.name)
    private readonly harvestedModel: Model<Harvested>,
  ) {}

  async getCollectionsByWeek(startOfWeek: string) {
    try {
      const startDate = new Date(startOfWeek);
      return this.harvestedModel.aggregate([
        {
          $match: {
            'week.start': new Date(startDate),
          },
        },
        { $unwind: '$days' },
        {
          $group: {
            _id: '$_id',
            employeeId: { $first: '$employeeId' },
            days: {
              $push: {
                dayId: '$days._id',
                day: '$days.day',
                date: '$days.date',
                coffeeAmount: '$days.coffeeAmount',
              },
            },
            Monday: {
              $sum: {
                $cond: [
                  { $eq: ['$days.day', 'Monday'] },
                  '$days.coffeeAmount',
                  0,
                ],
              },
            },
            Tuesday: {
              $sum: {
                $cond: [
                  { $eq: ['$days.day', 'Tuesday'] },
                  '$days.coffeeAmount',
                  0,
                ],
              },
            },
            Wednesday: {
              $sum: {
                $cond: [
                  { $eq: ['$days.day', 'Wednesday'] },
                  '$days.coffeeAmount',
                  0,
                ],
              },
            },
            Thursday: {
              $sum: {
                $cond: [
                  { $eq: ['$days.day', 'Thursday'] },
                  '$days.coffeeAmount',
                  0,
                ],
              },
            },
            Friday: {
              $sum: {
                $cond: [
                  { $eq: ['$days.day', 'Friday'] },
                  '$days.coffeeAmount',
                  0,
                ],
              },
            },
            Saturday: {
              $sum: {
                $cond: [
                  { $eq: ['$days.day', 'Saturday'] },
                  '$days.coffeeAmount',
                  0,
                ],
              },
            },
            Total: { $sum: '$days.coffeeAmount' },
          },
        },
        {
          $lookup: {
            from: 'employees',
            localField: 'employeeId',
            foreignField: 'employeeId',
            as: 'employeeInfo',
          },
        },
        {
          $project: {
            _id: 1,
            employeeId: '$employeeId',
            days: 1,
            firstName: {
              $arrayElemAt: ['$employeeInfo.firstName', 0],
            },
            lastName: {
              $arrayElemAt: ['$employeeInfo.lastName', 0],
            },
            Monday: 1,
            Tuesday: 1,
            Wednesday: 1,
            Thursday: 1,
            Friday: 1,
            Saturday: 1,
            Total: 1,
          },
        },
      ]);
    } catch (error) {
      console.error('Error en getCollectionsByWeek:', error);
      throw error;
    }
  }

  async createHarvested(
    createHarvestedDto: CreateHarvestedDto,
  ): Promise<Harvested> {
    // Ajustar la hora a medianoche (00:00:00)
    const adjustedStartDate = new Date(createHarvestedDto.week.start);
    adjustedStartDate.setUTCHours(0, 0, 0, 0);
    createHarvestedDto.week.start = adjustedStartDate;
    console.log('createHarvestedDto', createHarvestedDto.week.start);
    const harvested = new this.harvestedModel(createHarvestedDto);
    return await harvested.save();
  }

  async updateHarvested(updateHarvestedDto: UpdateHarvestedDto) {
    try {
      const { harvestedId, dayId, coffeeAmount } = updateHarvestedDto;

      const resultado = await this.harvestedModel.findOneAndUpdate(
        {
          _id: harvestedId,
          'days._id': dayId,
        },
        {
          $set: {
            'days.$.coffeeAmount': coffeeAmount,
          },
        },
        { new: true },
      );

      if (!resultado) {
        throw new Error('No se encontró el registro para actualizar');
      }

      return resultado;
    } catch (error) {
      console.error('Error al actualizar harvested:', error);
      throw error;
    }
  }
}
