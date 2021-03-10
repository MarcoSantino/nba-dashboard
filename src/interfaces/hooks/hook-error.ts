export interface HookError {
    error: string;
    set: (err: string) => void;
}