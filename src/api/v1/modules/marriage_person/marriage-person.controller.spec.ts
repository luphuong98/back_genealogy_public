import { Test, TestingModule } from '@nestjs/testing';
import { MarriagePersonController } from './marriage-person.controller';

describe('MarriagePersonController', () => {
  let controller: MarriagePersonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarriagePersonController],
    }).compile();

    controller = module.get<MarriagePersonController>(MarriagePersonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
