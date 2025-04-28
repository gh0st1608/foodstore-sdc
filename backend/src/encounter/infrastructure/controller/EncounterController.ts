import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { EncounterApplication } from '../../application/EncounterApplication';
import { CreateEncounterDto } from '../../application/dto/request/CreateEncounterRequest.dto';
import { TransformInterceptor } from '../../../common/infrastructure/interceptors/TransformInterceptor';
import { UpdateEncounterDto } from '../../application/dto/request/UpdateEncounterRequest.dto';
import { TelemedicineEncounterApplication } from '../../application/EncounterTelemedicineApplication';
import { CreateTelemedicineEncounterDto } from '../../application/dto/request/CreateTelemedicineEncounterRequest.dto';
import { UpdateTelemedicineEncounterDto } from '../../application/dto/request/UpdateTelemedicineEncounterRequest.dto';
import { HelperError } from '../../../common/infrastructure/errors/HelperError';
import { CustomParseUUIDPipe } from '../../application/dto/request/custom/id.dto';

@Controller('encounters')
@UseInterceptors(TransformInterceptor)
export class EncounterController {
  constructor(
    private readonly encounterApplication: EncounterApplication,
    private readonly telemedicineEncounterApplication: TelemedicineEncounterApplication
  ) { }

  @Post('register')
  async createEncounter(@Body() body: CreateEncounterDto) {
    return this.encounterApplication.create(body);
  }

  @Post('telemedicine/register')
  async createTelemedicineEncounter(@Body() body: CreateTelemedicineEncounterDto) {
    try {
      return this.telemedicineEncounterApplication.create(body);
    } catch (error) {
      console.log('entro al badrequestexception')
      if (error instanceof BadRequestException) {
        console.log('entro al badrequestexception')
        throw await HelperError.response(error); // ✅ Formatea los errores de validación correctamente
      }
      throw error;
    }
  
  }


  @Delete(':id')
  async deleteEncounter(@Param('id', CustomParseUUIDPipe) id: string) {
    return this.encounterApplication.delete(id);
  }

  @Delete('telemedicine/:id')
  async deleteTelemedicineEncounter(@Param('id', CustomParseUUIDPipe) id: string) {
    return this.telemedicineEncounterApplication.delete(id);
  }

  @Put(':id')
  async updateEncounter(@Param('id', CustomParseUUIDPipe) id: string, @Body() body: UpdateEncounterDto) {
    return this.encounterApplication.update(id, body);
  }

  @Put('telemedicine/:id')
  async updateTelemedicineEncounter(@Param('id', CustomParseUUIDPipe) id: string, @Body() body: UpdateTelemedicineEncounterDto) {
    return this.telemedicineEncounterApplication.update(id, body);
  }

  @Get(':id')
  async getEncounter(@Param('id', CustomParseUUIDPipe) id: string) {
    return this.encounterApplication.getEncounter(id);
  }

  @Get('telemedicine/:id')
  async getTelemedicineEncounter(@Param('id', CustomParseUUIDPipe) id: string) {
    try {
      return this.telemedicineEncounterApplication.getTelemedicineEncounter(id);
    } catch (error) {
      throw await HelperError.response(error);
    }
  }
}
