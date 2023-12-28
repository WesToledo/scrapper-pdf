import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFaturaDTO {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  clientNumber: string;

  @IsString()
  @IsNotEmpty()
  instalationNumber: string;

  @IsString()
  @IsNotEmpty()
  referenceMonth: string;

  @IsString()
  @IsNotEmpty()
  referenceYear: string;

  @IsNumber()
  @IsNotEmpty()
  eletric_energy_amount: number;

  eletric_energy_value: number;
  @IsNumber()
  @IsNotEmpty()
  sceee_energy_amount: number;

  @IsNumber()
  @IsNotEmpty()
  sceee_energy_value: number;

  @IsNumber()
  @IsNotEmpty()
  compensated_energy_amount: number;

  @IsNumber()
  @IsNotEmpty()
  compensated_energy_value: number;

  @IsNumber()
  @IsNotEmpty()
  public_ilumination_contrib: number;
}
