import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { User } from '../../domain/entities/user.entity';
import { ForgottenPassword } from '../../domain/entities/forgottenpassword.entity';
import { RefreshToken } from '../../domain/entities/refreshToken.entity';
import { Country } from 'src/domain/entities/country.entity';
import { Department } from 'src/domain/entities/department.entity';
import { City } from 'src/domain/entities/city.entity';
import { Area } from 'src/domain/entities/area.entity';
import { Zone } from 'src/domain/entities/zone.entity';
import { Neighborhood } from 'src/domain/entities/neighborhood.entity';
import { Company } from 'src/domain/entities/company.entity';
import { Role } from 'src/domain/entities/role.entity';
import { Address } from 'src/domain/entities/address.entity';
import { Route } from 'src/domain/entities/route.entity';
import { Permission } from 'src/domain/entities/permission.entity';
import { PermissionRole } from 'src/domain/entities/permission_role.entity';
import { ZoneNeighborhood } from 'src/domain/entities/zone_neighborhood.entity';
import { RouteDetail } from 'src/domain/entities/routeDetail.entity';
import { RouteObservation } from 'src/domain/entities/routeObservation.entity';
import { AddressesEvent } from 'src/domain/entities/addressesEvent';
import { RouteNovelty } from 'src/domain/entities/routeNovelty.entity';
import { Novelty } from 'src/domain/entities/novelty.entity';
import { Headquarters } from 'src/domain/entities/headquarters.entity';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: configService.get<string>(`database.host`),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
      });

      sequelize.addModels([
        User,
        ForgottenPassword,
        RefreshToken,
        Country,
        Department,
        City,
        Area,
        Zone,
        Neighborhood,
        Company,
        Role,
        Address,
        Route,
        Permission,
        PermissionRole,
        ZoneNeighborhood,
        RouteDetail,
        RouteObservation,
        AddressesEvent,
        RouteNovelty,
        Novelty,
        Headquarters,
      ]);
      await sequelize.sync(
        process.env.APP_ENV === 'development' && {
          force: true,
        },
      );
      return sequelize;
    },
  },
];
