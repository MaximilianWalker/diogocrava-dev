/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// Create a new database.
use('main');

db.createCollection('inputs', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            title: "Student Object Validation",
            required: ["name", "value", "created"],
            properties: {
                name: {
                    bsonType: ["string"],
                    description: "'name' must be a string and is required"
                },
                value: {
                    bsonType: ["string"],
                    description: "'value' must be a string and is required"
                },
                created: {
                    bsonType: ["date"],
                    description: "'created' must be a date and is required"
                }
            }
        }
    }
});

db.createCollection('chat_logs', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            title: "Student Object Validation",
            required: ["ip", "country", "messages"],
            properties: {
                // year: {
                //     bsonType: "int",
                //     minimum: 2017,
                //     maximum: 3017,
                //     description: "'year' must be an integer in [ 2017, 3017 ] and is required"
                // },
                ip: {
                    bsonType: ["string"],
                    description: "'gpa' must be a double if the field exists"
                },
                country: {
                    bsonType: ["string"],
                    description: "'gpa' must be a double if the field exists"
                },
                messages: {
                    bsonType: ["array"],
                    description: "'gpa' must be a double if the field exists"
                }
            }
        }
    }
});

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
