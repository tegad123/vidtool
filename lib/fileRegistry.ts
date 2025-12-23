import fs from "fs";
import path from "path";

export const OUTPUT_DIR = path.join(process.cwd(), "outputs");
const REGISTRY_FILE = path.join(OUTPUT_DIR, "index.json");

export interface FileMetadata {
    fileId: string;
    filename: string;
    contentType: string;
    size: number;
    createdAt: number;
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function loadRegistry(): Record<string, FileMetadata> {
    if (!fs.existsSync(REGISTRY_FILE)) return {};
    try {
        const data = fs.readFileSync(REGISTRY_FILE, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        console.error("[Registry] Failed to load registry:", err);
        return {};
    }
}

function saveRegistry(registry: Record<string, FileMetadata>) {
    try {
        fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2));
    } catch (err) {
        console.error("[Registry] Failed to save registry:", err);
    }
}

export function registerFile(meta: Omit<FileMetadata, "createdAt">) {
    const registry = loadRegistry();
    const newMeta: FileMetadata = { ...meta, createdAt: Date.now() };
    registry[meta.fileId] = newMeta;
    saveRegistry(registry);
    console.log(`[Registry] Registered file: ${meta.filename} (${meta.fileId})`);
}

export function getFile(fileId: string): FileMetadata | null {
    const registry = loadRegistry();
    const meta = registry[fileId];
    if (!meta) return null;

    // Verify file still exists on disk
    const absPath = path.join(OUTPUT_DIR, meta.filename);
    if (!fs.existsSync(absPath)) {
        console.warn(`[Registry] File missing on disk: ${meta.filename}`);
        return null;
    }
    return meta;
}

export function getAbsolutePath(filename: string): string {
    return path.join(OUTPUT_DIR, filename);
}
