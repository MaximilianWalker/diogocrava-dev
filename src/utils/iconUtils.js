import * as FeatherIcons from 'react-feather';
import SystemIcons from '@/icons/system';

const {
    ApplicationGeneric
} = SystemIcons;

const MIMETYPES_ICONS = {
    "text/plain": null,
    "text/html": null,
    "text/markdown": null,
    "text/csv": null,
    "application/generic": ApplicationGeneric,
    "application/pdf": null,
    "application/zip": null,
    "application/x-rar-compressed": null,
    "application/x-7z-compressed": null,
    "application/application/x-executable": null,
    "application/javascript": null,
    "application/json": null,
    "application/xml": null,
    "image/jpeg": null,
    "image/png": null,
    "image/gif": null,
    "image/svg+xml": null,
    "image/webp": null,
    "image/tiff": null,
    "video/mp4": null,
    "video/webm": null,
    "video/x-msvideo": null, // AVI
    "video/quicktime": null, // MOV
};

export function getIconByName(name) {
    return SystemIcons[name] || FeatherIcons[name];
}

export function getIconByMimetype(mimetype) {
    const icon = MIMETYPES_ICONS[mimetype];
    const genericIcon = MIMETYPES_ICONS[`${mimetype.split("/")[0]}/generic`];
    const defaultIcon = MIMETYPES_ICONS["application/generic"];
    return icon || genericIcon || defaultIcon;
};