export function splitText(text) {
    const lines = text.split(/\r?\n/);
    // for (let i = 0; i < lines.length; i++) {
    //     const line = lines[i];
    //     if (line.length > 100) {
    //         lines[i] = line.substring(0, 100);
    //         lines.splice(i + 1, 0, line.substring(100));
    //     }
    // }
    return lines;
};