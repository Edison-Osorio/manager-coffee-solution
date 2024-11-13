import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Harvested } from '../schemas/harvested.schema';
import { CreateHarvestedDto } from '../dtos/create-harvested.dto';
import { Model } from 'mongoose';

@Injectable()
export class HarvestedService {
  constructor(
    @InjectModel(Harvested.name)
    private readonly harvestedModel: Model<Harvested>,
  ) {}

  // Method to get collections (already implemented previously)
  async getCollectionsByWeek(startOfWeek: string) {
    try {
      const startDate = new Date(startOfWeek);
      console.log('Buscando registros para la fecha:', startDate);

      return this.harvestedModel.aggregate([
        {
          $match: {
            'week.start': new Date(startDate),
          },
        },
        { $unwind: '$days' },
        {
          $group: {
            _id: '$employeeId',
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
        // Opcional: Lookup para obtener el nombre del empleado si lo necesitas
        {
          $lookup: {
            from: 'employees', // nombre de la colección de empleados
            localField: '_id',
            foreignField: 'employeeId',
            as: 'employeeInfo',
          },
        },
        {
          $project: {
            _id: 1,
            employeeId: '$_id',
            name: {
              $concat: [
                { $arrayElemAt: ['$employeeInfo.firstName', 0] },
                ' ',
                { $arrayElemAt: ['$employeeInfo.lastName', 0] },
              ],
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
    const harvested = new this.harvestedModel(createHarvestedDto);
    return await harvested.save();
  }

  async getHarvestedByEmployeeId(employeeId: string) {
    return this.harvestedModel.find({ employee_id: employeeId });
  }

  async findAllHarvested() {
    const result = await this.harvestedModel.find().exec();
    console.log('Documentos encontrados:', result);
    return result;
  }

  // Método auxiliar para diagnóstico
  async diagnosticoDatos() {
    try {
      const todosLosDocumentos = await this.harvestedModel.find().exec();
      console.log('Total documentos:', todosLosDocumentos.length);

      if (todosLosDocumentos.length > 0) {
        console.log('Ejemplo de documento:', {
          week: todosLosDocumentos[0].week,
          days: todosLosDocumentos[0].days,
          employeeId: todosLosDocumentos[0].employeeId,
        });
      }

      // Obtener todas las fechas distintas
      const fechasUnicas = await this.harvestedModel.distinct('week.start');
      console.log('Fechas únicas en la base de datos:', fechasUnicas);

      return {
        totalDocumentos: todosLosDocumentos.length,
        fechasUnicas,
        ejemploDocumento: todosLosDocumentos[0],
      };
    } catch (error) {
      console.error('Error en diagnóstico:', error);
      throw error;
    }
  }
}
