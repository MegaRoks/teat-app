import { HttpException, Inject, Injectable } from '@nestjs/common';
import { addDays, differenceInDays, isWeekend } from 'date-fns';
import { Pool } from 'pg';

import { REST_DAYS_CAR } from './constants';
import { BookDto, CarDto, PriceCarDto } from './dto';
import { DATABASE_CONNECTION, PRICE_CAR } from '../database/constants';

@Injectable()
export class CarService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly connection: Pool,
  ) {}

  public async all() {
    try {
      const result = await this.connection.query<CarDto>('SELECT * FROM cars');

      return result.rows;
    } catch (e) {
      throw new HttpException(e.status, e.message);
    }
  }

  public async book(bookCarDto: BookDto) {
    try {
      const result = await this.connection.query<CarDto>(
        `INSERT INTO books (car_id, start_booked, end_booked) 
                            VALUES ('${bookCarDto.car_id}', '${bookCarDto.start_booked}', '${bookCarDto.end_booked}')`,
      );

      return result.rows[0];
    } catch (e) {
      throw new HttpException(e.status, e.message);
    }
  }

  public async getCarWithBooks(carId: number) {
    const result = await this.connection.query<CarDto>(
      `SELECT c.id, c.gos_number, b.start_booked, b.end_booked
                            FROM cars AS c
                                LEFT JOIN books AS b ON (b.car_id = c.id)
                                    WHERE c.id = ${carId}`,
    );

    return result.rows[0];
  }

  public async getCarsWithBooks() {
    const result = await this.connection.query<CarDto>(
      `SELECT c.id, c.gos_number, b.start_booked, b.end_booked
                            FROM cars AS c
                                LEFT JOIN books AS b ON (b.car_id = c.id)`,
    );

    return result.rows;
  }

  public isBook(date?: Date) {
    if (!date) {
      return true;
    }

    return new Date() > addDays(new Date(date), REST_DAYS_CAR);
  }

  public isWeekend(date: Date) {
    return isWeekend(new Date(date));
  }

  public isBookStartDate(startDate: Date, endDate: Date) {
    return new Date(startDate) > addDays(new Date(endDate), REST_DAYS_CAR);
  }

  public getDaysBook(priceCarDto: PriceCarDto) {
    return differenceInDays(
      new Date(priceCarDto.end_booked),
      new Date(priceCarDto.start_booked),
    );
  }

  public price(countDays: number) {
    let price = 0;

    for (let i = 0; i < countDays; i++) {
      if (i < 4) {
        price = price + PRICE_CAR;
      } else if (i < 9) {
        price = price + (PRICE_CAR - PRICE_CAR * 0.05);
      } else if (i < 17) {
        price = price + (PRICE_CAR - PRICE_CAR * 0.1);
      } else {
        price = price + (PRICE_CAR - PRICE_CAR * 0.15);
      }
    }

    return price;
  }
}
