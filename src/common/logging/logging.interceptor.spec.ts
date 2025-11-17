import { LoggingInterceptor } from './logging.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('LoggingInterceptor', () => {
    let interceptor: LoggingInterceptor;
    let mockLogger: { log: jest.Mock };

    beforeEach(() => {
        interceptor = new LoggingInterceptor();
        mockLogger = { log: jest.fn() };
        (interceptor as any).logger = mockLogger;
    });

    it('should be defined', () => {
        expect(interceptor).toBeDefined();
    });

    it('should call handle', (done) => {
        const mockReq = {
            method: 'GET',
            originalUrl: '/test-url',
        };

        const mockContext = {
            switchToHttp: () => ({
                getRequest: () => mockReq,
            }),
        } as unknown as ExecutionContext;

        const mockNext = {
            handle: () => of('ok'),
        } as unknown as CallHandler;

        interceptor.intercept(mockContext, mockNext).subscribe(() => {
            expect(mockLogger.log).toHaveBeenCalledTimes(1);

            const logMessage = mockLogger.log.mock.calls[0][0];
            expect(logMessage).toContain('GET');
            expect(logMessage).toContain('/test-url');
            expect(logMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T/);

            done();
        });
    });
});
