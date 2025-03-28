import { resolve } from 'path';

import { generateApi } from 'swagger-typescript-api';

generateApi({
    name: 'Api.ts',
    url: 'http://localhost:8000/swagger/?format=openapi',
    output: resolve(process.cwd(), './src/api'),
    input: resolve(process.cwd(), './swagger/petstore.yml'),
    httpClientType: 'axios',
});
