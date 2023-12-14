import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "./modules/auth/auth.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database:
        process.env.NODE_ENV === "development"
          ? "./database/sqlite/db"
          : "/tmp/sqlite/db",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    AuthModule,
    TasksModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
