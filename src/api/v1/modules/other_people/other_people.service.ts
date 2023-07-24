import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseServiceAbstract } from '../../services/base/base.abstract.service';
import { OtherPeople } from '../../entities/other_people.entity';
import { OtherPeopleRepositoryInterface } from './interfaces/other-people.interface';
import { CreateOtherDto } from './dtos/create-other.dto';
import {
  Key_Error_Marriage,
  Key_Error_Other,
} from '../../common/helpers/responses';
import { FindAllResponse } from '../../common/types/common.type';
import { UpdateOtherDto } from './dtos/update-other.dto';
import { PersonService } from '@modules/person/person.service';

@Injectable()
export class OtherPeopleService extends BaseServiceAbstract<OtherPeople> {
  constructor(
    @Inject('OtherPeopleRepositoryInterface')
    private readonly otherRepository: OtherPeopleRepositoryInterface,
    @Inject(PersonService)
    private readonly personService: PersonService,
  ) {
    super(otherRepository);
  }
  async createOtherPeople(
    createOtherDto: CreateOtherDto,
  ): Promise<OtherPeople> {
    const id = createOtherDto.person;
    const checkPerson = await this.personService.getOnePerson(id);
    if (!checkPerson) {
      throw new NotFoundException(Key_Error_Marriage.NOT_FOUND_PERSON);
    }
    const newMarriage = await this.otherRepository.create({
      ...createOtherDto,
      person: checkPerson,
    });
    if (!newMarriage) {
      throw new BadRequestException(Key_Error_Other.CANNOT_CREATE_OTHER);
    }
    return newMarriage;
  }

  async getAllOtherPeopleByPersonId(
    id: string,
  ): Promise<FindAllResponse<OtherPeople>> {
    const condition = { person: id };
    const checkPerson = await this.otherRepository.findAllWithSubFields(
      condition,
    );
    return checkPerson;
  }

  async getOneOtherPeople(id: string): Promise<OtherPeople> {
    const checkPerson = await this.otherRepository.findOneById(id);
    if (!checkPerson) {
      throw new NotFoundException(Key_Error_Other.NOT_FOUND_OTHER_PEOPLE);
    }
    return checkPerson;
  }

  async updateOtherPeople(id: string, updateOtherDto: UpdateOtherDto) {
    const checkPerson = await this.otherRepository.findOneById(id);
    if (!checkPerson) {
      throw new NotFoundException(Key_Error_Other.NOT_FOUND_OTHER_PEOPLE);
    }
    const update = await this.otherRepository.update(id, updateOtherDto);
    if (!update) {
      throw new BadRequestException(Key_Error_Other.CANNOT_UPDATE_OTHER);
    }
    return update;
  }
}
