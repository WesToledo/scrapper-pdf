import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateFaturaDTO } from './dto/fatura.dto';

@Injectable()
export class FaturaService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateFaturaDTO) {
    return this.prisma.fatura.create({
      data,
    });
  }

  list() {
    return this.prisma.fatura.findMany({
      where: {},
    });
  }

  listClientNumbers() {
    return this.prisma.fatura.findMany({
      where: {},
      distinct: 'clientNumber',
      select: {
        clientNumber: true,
      },
    });
  }

  getByClientNumber(clientNumber: string) {
    return this.prisma.fatura.findMany({
      where: { clientNumber },
    });
  }

  getGroupedByMonth(clientNumber?: string) {
    return this.prisma.fatura.groupBy({
      by: ['referenceMonth'],
      where: { clientNumber },

      _sum: {
        eletric_energy_amount: true,
        eletric_energy_value: true,
        sceee_energy_amount: true,
        sceee_energy_value: true,
        public_ilumination_contrib: true,
        compensated_energy_amount: true,
        compensated_energy_value: true,
      },
    });
  }
}
