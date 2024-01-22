const name = 'inputs';

function create(db) {
    db.createCollection(name, {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["name", "value", "timestamp"],
                properties: {
                    name: {
                        bsonType: "string",
                        description: "'name' must be a string and is required"
                    },
                    value: {
                        bsonType: "string",
                        description: "'value' must be a string and is required"
                    },
                    timestamp: {
                        bsonType: "timestamp",
                        description: "'timestamp' must be a date and is required"
                    }
                }
            }
        }
    });

    db.inputs.createIndex({ "name": 1 });
}

export default {
    name,
    create
}