import { DemoPath } from "./demo";
import { Swagger } from "./swagger";

const openapi = "3.0.0";
const info = {
    title: "Demo API",
    version: "1.0.0",
    description: "Demo API",
};
const servers = [
    {
        url: "http://localhost:3000",
        description: "Local server",
    },
];
const paths = {
    ...DemoPath
};
export const SwaggerDocument = new Swagger(openapi, info, servers, paths);