export interface CustomError extends Error {
    name: string;
}
export { BadRequest } from './bad-request';
export { AppError } from './app-error';
export { Conflict } from './conflict';
export { NotFound } from './not-found';
