const name = 'chat_logs';

async function create(db) {
    const locationProperties = {
        country: {
            bsonType: "string",
            description: "'name' must be a string and is required"
        },
        city: {
            bsonType: "string",
            description: "'value' must be a string and is required"
        }
    };

    return await db.createCollection(name, {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["ip", "location", "messages"],
                properties: {
                    ip: {
                        bsonType: "string",
                        description: "'ip' must be a double and is required"
                    },
                    location: {
                        bsonType: "object",
                        description: "'location' must be a double and is required",
                        required: ["ip", "timezone"],
                        properties: {
                            ip: {
                                bsonType: "object",
                                description: "'location.ip' must be a string and is required",
                                properties: locationProperties
                            },
                            timezone: {
                                bsonType: "object",
                                description: "'location.timezone' must be a string and is required",
                                properties: locationProperties
                            }
                        }
                    },
                    messages: {
                        bsonType: "array",
                        description: "'messages' must be a array and is required",
                        items: {
                            bsonType: "object",
                            required: ["value", "timestamp"],
                            properties: {
                                value: {
                                    bsonType: "string",
                                    description: "'value' must be a string and is required"
                                },
                                timestamp: {
                                    bsonType: "timestamp",
                                    description: "'timestamp' must be an integer and is required"
                                }
                            }
                        }
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