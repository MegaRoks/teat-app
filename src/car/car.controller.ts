import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BookDto, CarDto, NotFoundDto, PriceCarDto, StatCarDto } from './dto';
import { CarService } from './car.service';
import { LIMIT_BOOK_DAYS } from '../database/constants';

@ApiTags('car')
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get('/')
  @ApiOkResponse({
    type: [CarDto],
    description: 'The method return all cars',
  })
  public async all() {
    return await this.carService.all();
  }

  @Get('/check:id')
  @ApiOkResponse({
    type: CarDto,
    description: 'Check booking car',
  })
  @ApiNotFoundResponse({
    type: NotFoundDto,
    description: 'Car not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Id car',
  })
  public async check(@Param('id') id: number) {
    const car = await this.carService.getCarWithBooks(id);

    if (!car) {
      throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
    }

    if (!car.start_booked && !car.end_booked) {
      return {
        isBook: true,
      };
    }

    const isBook = this.carService.isBook(car.end_booked);

    return { isBook };
  }

  @Get('/stat')
  @ApiOkResponse({
    type: StatCarDto,
    description: 'Get stat car',
  })
  public async stat() {
    const carWithBooks = await this.carService.getCarsWithBooks();

    const cars = carWithBooks.reduce<{ [k: string]: number }>((acc, car) => {
      const daysBook = this.carService.getDaysBook({
        start_booked: car.start_booked,
        end_booked: car.end_booked,
      });

      if (acc[car.gos_number]) {
        return {
          ...acc,
          [car.gos_number]: acc[car.gos_number] + daysBook,
          total: (acc.total ? acc.total : 0) + daysBook,
        };
      } else {
        return {
          ...acc,
          [car.gos_number]: daysBook,
          total: (acc.total ? acc.total : 0) + daysBook,
        };
      }
    }, {});

    const total = carWithBooks.reduce((acc, car) => {
      const daysBook = this.carService.getDaysBook({
        start_booked: car.start_booked,
        end_booked: car.end_booked,
      });

      return acc + daysBook;
    }, 0);

    return { cars, total };
  }

  @Post('/book')
  public async book(@Body() bookDto: BookDto) {
    if (this.carService.isWeekend(bookDto.start_booked)) {
      throw new HttpException(
        'Start date cannot weekend date',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (this.carService.isWeekend(bookDto.end_booked)) {
      throw new HttpException(
        'End date cannot weekend date',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const car = await this.carService.getCarWithBooks(bookDto.car_id);
    if (!car) {
      throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
    }

    if (!car.start_booked && !car.end_booked) {
      return await this.carService.book(bookDto);
    }

    const isBook = this.carService.isBookStartDate(
      bookDto.start_booked,
      car.end_booked,
    );
    if (!isBook) {
      throw new HttpException('Car is booked', HttpStatus.NOT_ACCEPTABLE);
    }

    return await this.carService.book(bookDto);
  }

  @Post('/price')
  public price(@Body() priceCarDto: PriceCarDto) {
    const daysBook = this.carService.getDaysBook(priceCarDto);

    if (daysBook > LIMIT_BOOK_DAYS) {
      throw new HttpException(
        `Limit book days ${LIMIT_BOOK_DAYS}`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const prise = this.carService.price(daysBook);

    return { prise };
  }
}
