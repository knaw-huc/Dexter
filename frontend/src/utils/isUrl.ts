export default function isUrl(str: string) {
    if (!str) {
        return false
    }
    try {
        const url = new URL(str)
        return url.protocol === "http:" || url.protocol === "https:"
    } catch (e) {
        return false
    }
}