type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export class HTTPClient {
    public readonly baseHeaders: Record<string, string> = {
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE',
        'Content-Type': 'application/json;charset=UTF-8'
    };
    private readonly _requestTimeoutMS: number = 6000;
    private readonly _abortController = new AbortController();

    async makeRequest<TResult>(
        httpMethod: HTTPMethod,
        url: string,
        options?: {
            payload?: unknown
            headers?: Record<string, string>
        }
    ): Promise<TResult> {
        let body: string | undefined;

        if (
            !['GET', 'DELETE'].includes(httpMethod) &&
            options?.payload
        ) body = JSON.stringify(options.payload);

        // setTimeout(this._abortController.abort, this._requestTimeoutMS);
            
        const response: Response = await fetch(
            url, 
            {
                method: httpMethod, 
                headers: options?.headers ?? this.baseHeaders,
                body: body,
                signal: this._abortController.signal
            },
        );

        if (response.status >= 400) {
            const responseText = await response.text();

            throw new Error(`Unsuccessful status code, ${response.status}, returned. Response: ${responseText}.`);
        }
            
        return await response.json() as TResult;
    }
}