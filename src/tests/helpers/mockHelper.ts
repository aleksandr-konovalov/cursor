import { Request, Response } from 'express';
import { UserRequest, UserResponse } from '../../types/express';

export function createMockRequest(params: any = {}, body: any = {}): UserRequest {
    const req = {
        params,
        body,
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
        acceptsEncodings: jest.fn(),
        acceptsLanguages: jest.fn(),
        range: jest.fn(),
        query: {},
        cookies: {},
        signedCookies: {},
        // Add other required properties from Express.Request
    } as unknown as UserRequest;

    return req;
}

export function createMockResponse(): UserResponse {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        render: jest.fn().mockReturnThis(),
        redirect: jest.fn().mockReturnThis(),
        locals: {},
        headersSent: false,
        // Add other required properties from Express.Response
    } as unknown as UserResponse;

    return res;
} 