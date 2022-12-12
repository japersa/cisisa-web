import { ModuleMetadata } from '@nestjs/common';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigurationOptions } from 'aws-sdk';
import { AwsS3Service } from 'src/domain/services/aws.s3.service';
import { GeneratorService } from 'src/domain/services/generator.service';

export interface IS3ModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory: (...args: any[]) => Promise<ConfigurationOptions> | ConfigurationOptions;
    inject?: any[];
}

/**
 * @export
 * @class AwsModule
 */
@Module({})
export class AwsModule {
    static forRootS3Async(options: IS3ModuleAsyncOptions): DynamicModule {
        return {
            module: AwsModule,
            providers: [
                {
                    provide: "CONFIG_CONNECTION_OPTIONS",
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },
                AwsS3Service,
                GeneratorService,
            ],
            exports: [AwsS3Service, GeneratorService],
        };
    }
}