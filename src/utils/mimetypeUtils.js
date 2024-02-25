const mimeTypes = {
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'xml': 'application/xml',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp',
    'webp': 'image/webp',
    'ico': 'image/x-icon',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'mkv': 'video/x-matroska',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    'csv': 'text/csv',
    'ts': 'video/mp2t',
    'flac': 'audio/flac',
    'm4a': 'audio/mp4',
    'ogg': 'audio/ogg',
    'opus': 'audio/opus',
    'apk': 'application/vnd.android.package-archive',
    'appx': 'application/vnd.ms-appx',
    'deb': 'application/vnd.debian.binary-package',
    'rpm': 'application/x-rpm',
    'iso': 'application/x-iso9660-image',
    'tar': 'application/x-tar',
    'gz': 'application/gzip',
    'bz2': 'application/x-bzip2',
    'dmg': 'application/x-apple-diskimage',
    'exe': 'application/vnd.microsoft.portable-executable',
    'dll': 'application/vnd.microsoft.portable-executable',
    'msi': 'application/x-msi',
    'ps1': 'text/plain', // PowerShell scripts, commonly treated as plain text
    'sh': 'application/x-sh',
    'bat': 'application/x-bat',
    'crx': 'application/x-chrome-extension',
    'xpi': 'application/x-xpinstall', // Mozilla Firefox extension files
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'otf': 'font/otf',
    'eot': 'application/vnd.ms-fontobject',
    'sfnt': 'font/sfnt', // Generic font MIME type for TrueType and OpenType fonts
    'md': 'text/markdown',
    'yaml': 'application/x-yaml',
    'yml': 'application/x-yaml',
    'vmdk': 'application/x-virtualbox-vmdk', // For VMware Virtual Disk files, though not officially registered
    'ova': 'application/x-virtualbox-ova', // For Open Virtualization Format archives, similarly unofficial
    'ovf': 'application/ovf', // Commonly used, though not an official MIME type
};

function getExtension(filename) {
    return filename.split('.').pop();
}

function getMimeType(extension) {
    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
}

function getMimeTypeByFilename(filename) {
    return getMimeType(getExtension(filename));
}

export { getExtension, getMimeType, getMimeTypeByFilename };