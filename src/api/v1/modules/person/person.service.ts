import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from '../../services/base/base.abstract.service';
import { Person } from '../../entities/person.entity';
import { PersonRepositoryInterface } from './interfaces/person.interface';
import { CreatePersonDto } from './dtos/create-person.dto';
import { FindAllResponse } from '../../common/types/common.type';
import { UpdatePersonDto } from './dtos/update-person.dto';
import {
  Key_Error_Marriage,
  Key_Error_Person,
} from '../../common/helpers/responses';
import { ConditionPerson } from './interfaces/search.interface';

@Injectable()
export class PersonService extends BaseServiceAbstract<Person> {
  constructor(
    @Inject('PersonRepositoryInterface')
    private readonly personRepository: PersonRepositoryInterface,
  ) {
    super(personRepository);
  }

  async createNewPerson(
    create_dto: CreatePersonDto,
    parent_id?: string,
  ): Promise<Person> {
    const checkPerson = await this.personRepository.findOneByCondition({
      email: create_dto.email,
    });
    if (checkPerson) {
      // return null;
      throw new BadRequestException(Key_Error_Person.EMAIL_ALREADY_EXISTS);
    }
    if (!parent_id) {
      const newPerson = await this.personRepository.create(create_dto);
      return newPerson;
    }
    const id = parent_id;
    const parentNode = await this.personRepository.findOneById(id);

    if (!parentNode) {
      // return null;
      throw new BadRequestException(Key_Error_Person.CANNOT_CREATE_PERSON);
    }

    const newPerson = await this.personRepository.create({
      ...create_dto,
      parent: parentNode,
      ancestors: parentNode.ancestors.concat(parentNode),
    });
    return newPerson;
  }
  async getAllPerson(
    condition?: object,
    projection?: string,
  ): Promise<FindAllResponse<Person>> {
    // return await this.personRepository.findAllWithSubFields(
    //   condition,
    //   projection,
    // );
    return await this.personRepository.findAllShort();
  }

  async getOnePerson(id: string): Promise<Person> {
    return await this.personRepository.findOneById(id);
  }

  async getOnePersonDetail(
    condition?: ConditionPerson,
    page?: number,
    limit?: number,
  ): Promise<FindAllResponse<Person>> {
    const person = await this.personRepository.findPersonWithOtherAndMarriage(
      condition,
      page,
      limit,
    );
    if (!person) {
      throw new BadRequestException(Key_Error_Marriage.NOT_FOUND_PERSON);
    }
    return person;
  }

  async updatePerson(
    id: string,
    updatePersonDto: UpdatePersonDto,
    email?: string,
  ) {
    const checkEmail = await this.personRepository.findOneByCondition({
      email,
      _id: { $nin: id },
    });
    if (checkEmail) {
      throw new BadRequestException(Key_Error_Person.EMAIL_ALREADY_EXISTS);
    }
    const person = await this.personRepository.update(id, updatePersonDto);
    if (!person) {
      throw new BadRequestException(Key_Error_Person.CANNOT_UPDATE_PERSON);
    }
    return person;
  }
}
