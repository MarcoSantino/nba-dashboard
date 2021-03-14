export function upperCaseFirst(input: string | undefined) {
    return `${input?.charAt(0).toUpperCase()}${input?.substr(1)}`;
}