import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import { TagService } from "./service";
import { TagController } from "./controller";

@Module({
    imports: [PrismaModule],
    providers: [
        PrismaService,
        TagService
    ],
    controllers: [TagController]
})
export class TagModule{}