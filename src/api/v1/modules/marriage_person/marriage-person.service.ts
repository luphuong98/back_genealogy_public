import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MarriagePersonRepositoryInterface } from './interfaces/marriage-person.interface';
import { BaseServiceAbstract } from '../../services/base/base.abstract.service';
import { MarriagePerson } from '../../entities/marriage_person.entity';
import { CreateMarriageDto } from './dtos/create-marriage.dto';
import { Key_Error_Marriage } from '../../common/helpers/responses';
import { FindAllResponse } from '../../common/types/common.type';
import { UpdateMarriageDto } from './dtos/update-marriage.dto';
import { PersonService } from '@modules/person/person.service';

@Injectable()
export class MarriagePersonService extends BaseServiceAbstract<MarriagePerson> {
  constructor(
    @Inject('MarriageRepositoryInterface')
    private readonly marriageRepository: MarriagePersonRepositoryInterface,
    @Inject(PersonService)
    private readonly personService: PersonService,
  ) {
    super(marriageRepository);
  }

  async createMarriagePerson(
    createMarriageDto: CreateMarriageDto,
  ): Promise<MarriagePerson> {
    const id = createMarriageDto.person;
    const checkPerson = await this.personService.getOnePerson(id);
    if (!checkPerson) {
      throw new NotFoundException(Key_Error_Marriage.NOT_FOUND_PERSON);
    }
    const newMarriage = await this.marriageRepository.create({
      ...createMarriageDto,
      person: checkPerson,
    });
    if (!newMarriage) {
      throw new BadRequestException(Key_Error_Marriage.CANNOT_CREATE_MARRIAGE);
    }
    return newMarriage;
  }
  async getAllMarriagePersonByPersonId(
    id: string,
  ): Promise<FindAllResponse<MarriagePerson>> {
    const condition = { person: id };
    const checkPerson = await this.marriageRepository.findAllWithSubFields(
      condition,
    );
    return checkPerson;
  }

  async getOneMarriagePerson(id: string): Promise<MarriagePerson> {
    const checkPerson = await this.marriageRepository.findOneById(id);
    if (!checkPerson) {
      throw new NotFoundException(Key_Error_Marriage.NOT_FOUND_MARRIAGE_PERSON);
    }
    return checkPerson;
  }

  async updateMariagePerson(id: string, updateMarriageDto: UpdateMarriageDto) {
    const checkPerson = await this.marriageRepository.findOneById(id);
    if (!checkPerson) {
      throw new NotFoundException(Key_Error_Marriage.NOT_FOUND_MARRIAGE_PERSON);
    }
    const update = await this.marriageRepository.update(id, updateMarriageDto);
    if (!update) {
      throw new BadRequestException(Key_Error_Marriage.CANNOT_UPDATE_MARRIAGE);
    }
    return update;
  }
}
