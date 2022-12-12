import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import configuration from '../config/configuration';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './infrastructure/modules/user.module';
import { AuthModule } from './infrastructure/modules/auth.module';
import { CountryModule } from './infrastructure/modules/country.module';
import { DepartmentModule } from './infrastructure/modules/department.module';
import { CityModule } from './infrastructure/modules/city.module';
import { AreaModule } from './infrastructure/modules/area.module';
import { ZoneModule } from './infrastructure/modules/zone.module';
import { NeighborhoodModule } from './infrastructure/modules/neighborhood.module';
import { CompanyModule } from './infrastructure/modules/company.module';
import { RoleModule } from './infrastructure/modules/role.module';
import { AddressModule } from './infrastructure/modules/address.module';
import { RouteModule } from './infrastructure/modules/route.module';
import { PermissionModule } from './infrastructure/modules/permission.module';
import { PermissionRoleModule } from './infrastructure/modules/permission_role.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ZoneNeighborhoodModule } from './infrastructure/modules/zone_neighborhood.module';
import { UploadModule } from './infrastructure/modules/upload.module';
import { RouteDetailModule } from './infrastructure/modules/routeDetail.module';
import { RouteObservationModule } from './infrastructure/modules/routeObservation.module';
import { AddressesEventModule } from './infrastructure/modules/addressesEvent.module';
import { RouteNoveltyModule } from './infrastructure/modules/routeNovelty.module';
import { NoveltyModule } from './infrastructure/modules/novelty.module';
import { HeadquartersModule } from './infrastructure/modules/headquarters.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FilesModule } from './infrastructure/modules/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: process.cwd() + '/public',
      exclude: ['/api*', '/docs*'],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    CountryModule,
    DepartmentModule,
    CityModule,
    AreaModule,
    ZoneModule,
    NeighborhoodModule,
    CompanyModule,
    RoleModule,
    AddressModule,
    RouteModule,
    PermissionModule,
    PermissionRoleModule,
    ZoneNeighborhoodModule,
    UploadModule,
    RouteDetailModule,
    RouteObservationModule,
    AddressesEventModule,
    RouteNoveltyModule,
    NoveltyModule,
    HeadquartersModule,
    FilesModule
  ],
  providers: [AppService],
})
export class AppModule { }
