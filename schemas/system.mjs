const name = 'system';

function create(db) {
    const commonProperties = {
        name: {
            bsonType: "string",
            description: "'name' must be a string and is required"
        },
        icon: {
            bsonType: "string",
            description: "'icon' can be a string"
        },
        access: {
            bsonType: "bool",
            description: "'access' must be a boolean"
        }
    };

    const folderSchema = {
        bsonType: "object",
        required: ["type", "name", "access"],
        properties: {
            ...commonProperties,
            type: {
                bsonType: "string",
                enum: ["folder"],
                description: "'type' must be 'folder' and is required"
            },
            children: {
                bsonType: "array",
                description: "'children' must be an array of folders or files",
                items: {
                    bsonType: "objectId",
                    description: "each item in 'children' must be an objectId referencing another folder or file"
                }
            }
        }
    };

    const fileSchema = {
        bsonType: "object",
        required: ["type", "name", "access"],
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

    db.createCollection(name, {
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