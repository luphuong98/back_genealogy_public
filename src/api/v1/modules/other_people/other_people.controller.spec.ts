import { Test, TestingModule } from '@nestjs/testing';
import { OtherPeopleController } from './other_people.controller';

describe('OtherPeopleController', () => {
  let controller: OtherPeopleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtherPeopleController],
    }).compile();

    controller = module.get<OtherPeopleController>(OtherPeopleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
