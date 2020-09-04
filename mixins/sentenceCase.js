
function sentenceCase(camelCaseStr) {
    /**
     * Capitalizes the first letter of each word in a string and puts spaces between
     * :param str camelCaseStr: Input string
     * :return str: String with each word capitalized and spaced out
     */
    const spacedStr = camelCaseStr.replace(/([A-Z]+)/g, " $1").trim().replace(/\s\s+/g, " ")

    const capitalize_str = spacedStr.replace(/(\w)\S*/g, (match, firstChar) => {
        return firstChar.toUpperCase() + match.slice(1)
    })

    return capitalize_str
}

module.exports = sentenceCase;