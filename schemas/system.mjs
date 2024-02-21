const name = 'system';

async function create(db) {
    const commonProperties = {
        parent: {
            bsonType: ["null", "objectId"],
            description: "'parent' must be an objectId"
        },
        name: {
            bsonType: "string",
            description: "'name' must be a string and is required"
        },
        icon: {
            bsonType: ["null", "string"],
            description: "'icon' can be a string"
        },
        access: {
            bsonType: "bool",
            description: "'access' must be a boolean"
        },
        hidden: {
            bsonType: "bool",
            description: "'hidden' must be a boolean"
        }
    };

    const folderSchema = {
        bsonType: "object",
        required: ["type", "name", "access", "hidden"],
        properties: {
            ...commonProperties,
            type: {
                bsonType: "string",
                enum: ["folder"],
                description: "'type' must be 'folder' and is required"
            },
            path: {
                bsonType: "string",
                description: "'path' must be a string"
            },
        }
    };

    const fileSchema = {
        bsonType: "object",
        required: ["type", "name", "access", "hidden", "mimetype", "content_url"],
        properties: {
            ...commonProperties,
            type: {
                bsonType: "string",
                enum: ["file"],
                description: "'type' must be 'file' and is required"
            },
            mimetype: {
                bsonType: "string",
                description: "'mimetype' can be a string"
            },
            content_url: {
                bsonType: "string",
                description: "'content_url' can be a string"
            }
        }
    };

    return await db.createCollection(name, {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                oneOf: [folderSchema, fileSchema]
            }
        }
    });
}

export default {
    name,
    create
}