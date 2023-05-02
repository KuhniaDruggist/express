import { Request } from 'express';

export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestWithQueryParams<T> = Request<{}, {}, {}, T>;
export type RequestWithURIParams<T> = Request<T>;
export type RequestWithURIParamsAndBody<T, B> = Request<T, {}, B>;
