declare class FileReader {
    onload: (e: Event) => void;
    readAsArrayBuffer(blob: Blob): void;
    // Other relevant methods for FileReader
}
