import java.lang.IllegalArgumentException

enum class SupportedMediaType(val mediaType: String) {
    IMAGE_JPEG("image/jpeg"),
    IMAGE_PNG( "image/png");

    companion object {
        fun fromMediaType(mediaType: String?): SupportedMediaType? {
            for (b in SupportedMediaType.values()) {
                if (b.mediaType.equals(mediaType, ignoreCase = true)) {
                    return b
                }
            }
           return null
        }
    }
}
