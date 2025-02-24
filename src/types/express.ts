import { Request, Response } from 'express';

export type UserRequestParams = {
    id?: string;
}

export type UserRequestBody = {
    name: string;
    email: string;
}

export type UserRequest = Request<UserRequestParams, any, UserRequestBody>;
export type UserResponse = Response; 