const name = 'explorer_sections';

function create(db) {
    db.createCollection(name, {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["name", "icon", "links"],
                properties: {
                    name: {
                        bsonType: "string",
                        description: "'name' must be a string and is required"
                    },
                    icon: {
                        bsonType: "string",
                        description: "'icon' must be a string and is required"
                    },
                    links: {
                        bsonType: "array",
                        items: {
                            bsonType: "object",
                            required: ["name", "icon", "path"],
                            properties: {
                                name: {
                                    bsonType: "string",
                                    description: "'name' must be a string and is required"
                                },
                                icon: {
                                    bsonType: "string",
                                    description: "'icon' must be a string and is required"
                                },
                                path: {
                                    bsonType: "string",
                                    description: "'path' must be a string and is required"
                                }
                            }
                        },
                        description: "'links' must be an array of objects with 'name', 'icon', and 'path' fields and is required"
                    }
                }
            }
        }
    });

    db.tabs.createIndex({ "name": 1 });
}

export default {
    name,
    create
};
