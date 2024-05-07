const mimetypeToLanguage = {
    "text/html": "HTML",
    "text/css": "CSS",
    "application/javascript": "JavaScript",
    "text/javascript": "JavaScript",
    "application/json": "JSON",
    "text/x-python": "Python",
    "application/java-archive": "Java",
    "application/x-ruby": "Ruby",
    "text/x-c": "C",
    "text/x-csrc": "C",
    "text/x-c++src": "C++",
    "text/x-csharp": "C#",
    "text/x-haskell": "Haskell",
    "text/x-swift": "Swift",
    "text/x-rustsrc": "Rust",
    "text/x-scala": "Scala",
    "text/x-go": "Go",
    "application/typescript": "TypeScript",
    "application/xml": "XML",
    "application/x-php": "PHP",
    "application/x-perl": "Perl",
    "text/x-sql": "SQL",
    "application/x-lua": "Lua",
    "text/x-kotlin": "Kotlin",
    "text/x-dart": "Dart",
    "application/x-sh": "Shell Script",
};

export function getProgrammingLanguage(mimetype) {
    return mimetypeToLanguage[mimetype];
}
