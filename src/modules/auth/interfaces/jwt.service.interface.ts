export interface IJwtService {
    sign(payload: any): string;
    signAsync?(payload: any): Promise<string>;
    verify<T = any>(token: string): T;
    verifyAsync?<T = any>(token: string): Promise<T>;
}
