import * as FeatherIcons from 'react-feather';
import * as SystemIcons from '@/icons/system';

const {
    ApplicationGeneric,
    ApplicationJson,
    ApplicationPdf,
    TextCss,
    TextHtml,
    TextMarkdown,
    TextGeneric,
    TextJavascript,
    ImageGeneric
} = SystemIcons;

const MIMETYPES_ICONS = {
    "text/plain": TextGeneric,
    "text/html": TextHtml,
    "text/markdown": TextMarkdown,
    "text/csv": null,
    "text/css": TextCss,
    "text/javascript": TextJavascript,
    "application/generic": ApplicationGeneric,
    "application/pdf": ApplicationPdf,
    "application/zip": null,
    "application/x-rar-compressed": null,
    "application/x-7z-compressed": null,
    "application/application/x-executable": null,
    // "application/javascript": TextJavascript,
    "application/json": ApplicationJson,
    "application/xml": null,
    "image/jpeg": ImageGeneric,
    "image/png": ImageGeneric,
    "image/gif": ImageGeneric,
    "image/svg+xml": ImageGeneric,
    "image/webp": ImageGeneric,
    "image/tiff": ImageGeneric,
    "image/vnd.microsoft.icon": ImageGeneric,
    "video/mp4": null,
    "video/webm": null,
    "video/x-msvideo": null, // AVI
    "video/quicktime": null, // MOV
};

// https://www.svgviewer.dev/svg-to-react-jsx
export function getIconByName(name) {
    return SystemIcons[name] || FeatherIcons[name];
}

export function getIconByMimetype(mimetype) {
    if (!mimetype)
        return MIMETYPES_ICONS["application/generic"];

    const icon = MIMETYPES_ICONS[mimetype];
    const genericIcon = MIMETYPES_ICONS[`${mimetype.split("/")[0]}/generic`];
    return icon || genericIcon;
};