export abstract class DataFetcher<T> {
    constructor() { }

    isSuccessfulHTTPCode = (responseCode: number) => {
        const stringifiedResponseCode = `${responseCode}`;
        return (
            !stringifiedResponseCode.startsWith("4") &&
            !stringifiedResponseCode.startsWith("5")
        );
    };

    abstract getList(): Promise<T[]>

    abstract addSingle(fields: T): Promise<{ entity: T | undefined; httpCode: number }>;

    abstract editSingle(fields: T): Promise<{ entity: T | undefined; httpCode: number }>;

    abstract deleteSingle(id: string): Promise<{ httpCode: number}>;
    
}