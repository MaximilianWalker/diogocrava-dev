export class AtlasAPI {
    constructor() {
        this.apiKey = process.env.MONGODB_API_KEY;
        this.dataSource = process.env.MONGODB_API_DATA_SOURCE;
        this.database = process.env.MONGODB_DATABASE;
        this.baseUrl = process.env.MONGODB_API_ENDPOINT;
    }

    collection(collectionName) {
        return new Collection(this, collectionName);
    }

    createRequest(endpoint, method, collection, body) {
        const url = `${this.baseUrl}/action/${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'apiKey': this.apiKey,
        };

        const modifiedBody = {
            ...body,
            collection,
            database: this.database,
            dataSource: this.dataSource,
        };

        return new Request(url, method, headers, modifiedBody);
    }
}

export class Collection {
    constructor(atlasAPI, collectionName) {
        this.atlasAPI = atlasAPI;
        this.collectionName = collectionName;
    }

    createRequest(endpoint, method, body) {
        return this.atlasAPI.createRequest(endpoint, method, this.collectionName, body);
    }

    findOne(query, projection = null) {
        return this.createRequest('findOne', 'POST', { filter: query, projection });
    }

    find(query, projection = null,) {
        return this.createRequest('find', 'POST', { filter: query, projection });
    }

    insertOne(document) {
        return this.createRequest('insertOne', 'POST', { document });
    }

    insertMany(documents) {
        return this.createRequest('insertMany', 'POST', { documents });
    }

    updateOne(filter, update) {
        return this.createRequest('updateOne', 'POST', { filter, update });
    }

    updateMany(filter, update) {
        return this.createRequest('updateMany', 'POST', { filter, update });
    }

    deleteOne(filter) {
        return this.createRequest('deleteOne', 'POST', { filter });
    }

    deleteMany(filter) {
        return this.createRequest('deleteMany', 'POST', { filter });
    }

}

export class Request {
    constructor(url, method, headers, body) {
        this.url = url;
        this.method = method;
        this.headers = headers;
        this.body = body;
    }

    filter(filter) {
        this.body.filter = this.body.filter ? { ...this.body.filter, ...filter } : filter;
        return this;
    }

    project(projection) {
        this.body.projection = projection;
        return this;
    }

    sort(sort) {
        this.body.sort = sort;
        return this;
    }

    limit(limit) {
        this.body.limit = limit;
        return this;
    }

    skip(skip) {
        this.body.skip = skip;
        return this;
    }

    async run() {
        const response = await fetch(this.url, {
            method: this.method,
            headers: this.headers,
            body: JSON.stringify(this.body),
        });

        if (response.status >= 400) throw new Error(response.text());

        const result = await response.json();

        if (result.error) throw new Error(result.message);

        return result.documents ?? result.document ?? null;
    }
}

export const connection = new AtlasAPI();