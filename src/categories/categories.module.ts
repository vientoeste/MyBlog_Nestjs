import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CategoryHistoryEntity } from './entities/category_history.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CategoryEntity]),
        TypeOrmModule.forFeature([CategoryHistoryEntity]),
    ],
    providers: [CategoriesService],
})
export class CategoriesModule { }
