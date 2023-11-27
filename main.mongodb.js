/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// Create a new database.
use('main');

let exists = db.getCollectionNames().includes('inputs');

if (!exists) {
    db.createCollection('inputs', {
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

exists = db.getCollectionNames().includes("chat_logs");

if (!exists) {
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

    db.createCollection('chat_logs', {
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

// The prototype form to create a collection:
/* db.createCollection( <name>,
  {
    capped: <boolean>,
    autoIndexId: <boolean>,
    size: <number>,
    max: <number>,
    storageEngine: <document>,
    validator: <document>,
    validationLevel: <string>,
    validationAction: <string>,
    indexOptionDefaults: <document>,
    viewOn: <string>,
    pipeline: <pipeline>,
    collation: <document>,
    writeConcern: <document>,
    timeseries: { // Added in MongoDB 5.0
      timeField: <string>, // required for time series collections
      metaField: <string>,
      granularity: <string>,
      bucketMaxSpanSeconds: <number>, // Added in MongoDB 6.3
      bucketRoundingSeconds: <number>, // Added in MongoDB 6.3
    },
    expireAfterSeconds: <number>,
    clusteredIndex: <document>, // Added in MongoDB 5.3
  }
)*/

// More information on the `createCollection` command can be found at:
// https://www.mongodb.com/docs/manual/reference/method/db.createCollection/
