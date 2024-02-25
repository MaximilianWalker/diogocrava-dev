const name = 'explorer_sections';

async function create(db) {
    return await db.createCollection(name, {
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
                        bsonType: ["null", "string"],
                        description: "'icon' must be a string and is required"
                    },
                    order: {
                        bsonType: "int",
                        description: "'order' must be an integer and is required"
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
                                    bsonType: ["null", "string"],
                                    description: "'icon' must be a string and is required"
                                },
                                order: {
                                    bsonType: "int",
                                    description: "'order' must be an integer and is required"
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
}

export default {
    name,
    create
};
