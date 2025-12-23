import path from "path";
import fs from "fs";

// Centralized output directory definition
export const OUTPUT_DIR = path.join(process.cwd(), "outputs");

// Ensure output directory exists on module load
if (!fs.existsSync(OUTPUT_DIR)) {
    try {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    } catch (err) {
        console.error(`[FileStore] Failed to create output directory: ${OUTPUT_DIR}`, err);
    }
}

export interface FileMetadata {
    fileId: string;
    absolutePath: string;
    filename: string;
    contentType: string;
}

// In-memory registry (clears on restart, but persists across HMR in dev via global)
const globalForFileStore = global as unknown as { fileRegistry: Map<string, FileMetadata> };

const fileRegistry = globalForFileStore.fileRegistry || new Map<string, FileMetadata>();

if (process.env.NODE_ENV !== "production") {
    globalForFileStore.fileRegistry = fileRegistry;
}

/**
 * Registers a file in the in-memory registry.
 */
export function registerFile(meta: FileMetadata) {
    fileRegistry.set(meta.fileId, meta);
    console.log(`[FileStore] Registered file: ${meta.fileId} (${meta.filename}). Total files: ${fileRegistry.size}`);
}

/**
 * Retrieves file metadata by fileId.
 * Validates existence on disk.
 */
export function getFile(fileId: string): FileMetadata | null {
    const meta = fileRegistry.get(fileId);
    if (!meta) return null;

    // Verify file still exists on disk
    if (!fs.existsSync(meta.absolutePath)) {
        console.warn(`[FileStore] File missing on disk: ${meta.absolutePath}`);
        return null;
    }

    return meta;
}

