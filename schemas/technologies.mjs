const name = 'technologies';

async function create(db) {
    return await db.createCollection(name, {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["type", "name", "snippet", "hidden", "mimetype", "content_url"],
                properties: {
                    type: {
                        bsonType: "string",
                        enum: ["frontend", "backend", "databases", ],
                        description: "'type' must be 'file' and is required"
                    },
                    name: {
                        bsonType: "string",
                        description: "'name' can be a string"
                    },
                    logo: {
                        bsonType: "string",
                        description: "'logo' can be a string"
                    },
                    snippet: {
                        bsonType: "string",
                        description: "'snippet' can be a string"
                    }
                }
            }
        }
    });
}

export default {
    name,
    create
}