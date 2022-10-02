interface SwaggerInfo {
    title: string;
    version: string;
    description: string;
}

interface SwaggerServer {
    url: string;
    description: string;
}

interface SwaggerParameter {
    name: string;
    in: string;
    description: string;
    required: boolean;
    schema: {
        type: string;
    };
}

interface SwaggerOperation {
    [key: string]: {
        summary: string;
        description: string;
        operationId: string;
        tags: string[];
        parameters: SwaggerParameter[];
        responses: any;
    }
}

export interface SwaggerPath {
    [key: string]: {
        summary: string,
        description: string
    };
}

export class Swagger {
    constructor(
        private readonly openapi: string,
        private readonly info: SwaggerInfo,
        private readonly servers: SwaggerServer[],
        private readonly paths: SwaggerPath,
    ) {}

    public getDocument(): string {
        return JSON.stringify(this, null, 2);
    }
}