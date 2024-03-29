import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "./modules/auth/auth.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { UsersModule } from "./modules/users/users.module";
import { ConfigDatabase } from "./database/config";

@Module({
  imports: [
    AuthModule,
    TasksModule,
    UsersModule,
    TypeOrmModule.forRoot(ConfigDatabase),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
