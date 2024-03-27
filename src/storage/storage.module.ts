import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageProvider } from './storage.provider';
import { StorageController } from './storage.controller';

@Module({
  providers: [StorageService, StorageProvider],
  exports: [StorageService, StorageProvider],
  controllers: [StorageController],
})
export class StorageModule {}
