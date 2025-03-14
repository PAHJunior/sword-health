import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpExceptionOptions,
  HttpException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

export enum TypeOrmErrorCode {
  UNIQUE_VIOLATION = '23505', // Postgres
  MYSQL_UNIQUE_VIOLATION = 'ER_DUP_ENTRY', // MySQL - Duplicate entry
  NOT_NULL_VIOLATION = '23502', // Postgres
  FOREIGN_KEY_VIOLATION = '23503', // Postgres
}

interface ErrorDetail {
  message: string | ((column?: string) => string);
  status: HttpStatus;
  httpExceptionOptions?: HttpExceptionOptions;
}

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter extends BaseExceptionFilter {
  public constructor(private logger: Logger) {
    super();
  }

  private errorDetails: { [key: string]: ErrorDetail } = {
    [TypeOrmErrorCode.UNIQUE_VIOLATION]: {
      message: 'Resource already exists.',
      status: HttpStatus.CONFLICT,
    },
    [TypeOrmErrorCode.MYSQL_UNIQUE_VIOLATION]: {
      message: 'Duplicate entry detected. This value must be unique.',
      status: HttpStatus.CONFLICT,
    },
    [TypeOrmErrorCode.NOT_NULL_VIOLATION]: {
      message: (column: string) =>
        `Cannot be null. Please provide a valid ${column}.`,
      status: HttpStatus.BAD_REQUEST,
    },
    [TypeOrmErrorCode.FOREIGN_KEY_VIOLATION]: {
      message: 'Foreign key violation. Please check related data.',
      status: HttpStatus.BAD_REQUEST,
    },
  };

  private getErrorDetail(code: string, column?: string): ErrorDetail {
    const errorDetail = this.errorDetails[code];

    if (errorDetail) {
      return {
        message:
          typeof errorDetail.message === 'function'
            ? errorDetail.message(column)
            : errorDetail.message,
        status: errorDetail.status,
      };
    }

    return {
      message: 'An unknown error occurred.',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  catch(exception: any, host: ArgumentsHost) {
    const errorDetail = this.getErrorDetail(exception?.code, exception?.column);
    this.logger.error(
      `Error: ${typeof errorDetail.message === 'string' ? errorDetail.message : ''}`,
      exception,
    );
    super.catch(
      new HttpException(
        {
          status: errorDetail.status,
          error: errorDetail.message,
        },
        errorDetail.status,
        {
          cause: errorDetail.httpExceptionOptions,
        },
      ),
      host,
    );
  }
}
