import { Controller, Get, Param } from '@nestjs/common';
import { FaturaService } from './fatura.service';

@Controller('fatura')
export class FaturaController {
  constructor(private faturaService: FaturaService) {}

  @Get('/list')
  async list() {
    return await this.faturaService.list();
  }

  @Get('/list-client-numbers')
  async listClientNumbers() {
    return await this.faturaService.listClientNumbers();
  }

  @Get('/list/:clientNumber')
  async getByClientNumber(@Param('clientNumber') clientNumber: string) {
    return await this.faturaService.getByClientNumber(clientNumber);
  }

  @Get('/list-by-month/:clientNumber?')
  async groupedByMonth(@Param('clientNumber') clientNumber?: string) {
    return await this.faturaService.getGroupedByMonth(clientNumber);
  }
}
