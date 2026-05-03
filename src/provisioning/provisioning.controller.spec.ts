import { Test, TestingModule } from '@nestjs/testing';
import { ProvisioningController } from './provisioning.controller';

describe('ProvisioningController', () => {
  let controller: ProvisioningController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvisioningController],
    }).compile();

    controller = module.get<ProvisioningController>(ProvisioningController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
