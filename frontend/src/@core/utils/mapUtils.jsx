import tileUtils from './tileUtils';

export function createMapData(width, height, callback) {
    return Array.from({ length: height }).map((_, y) => {
        return Array.from({ length: width }).map((__, x) => {
            return callback({ x, y });
        });
    });
}

export function getTilesFromRect(offset, width, height) {
    const list = [];
    Array.from({ length: height }).forEach((_, y) => {
        Array.from({ length: width }).forEach((__, x) => {
            list.push(tileUtils({ x, y }).add(offset));
        });
    });
    return list;
}

export function getTilesFromMapData(data, filter) {
    const list = [];
    data.forEach((row, y) => {
        row.forEach((value, x) => {
            if (filter(value)) {
                list.push({ x, y });
            }
        });
    });
    return list;
}

export function mapDataString(str) {
    const lineBreak = '\n';
    const data = [];
    let line = -1;
    let string = str;
    
    // strip any break at the end
    if (string[string.length - 1] === lineBreak) {
        string = string.slice(0, -1);
    }
    
    for (const char of string) {
        if (char === ' ') continue;
        if (char === lineBreak) {
            data[++line] = [];
        } else {
            data[line].push(char);
        }
    }
    return data;
}

export function injectMapData(source, data, { x, y }) {
    data.forEach((row, indexY, { length }) => {
        row.forEach((col, indexX) => {
            source[source.length - y - (length - indexY)][x + indexX] = col;
        });
    });
}
