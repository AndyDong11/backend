
function capitalize(str) {
    /**
     * Capitalizes the first letter of each word in a string
     * :param str str: Input string
     * :return str: String with each word capitalized
     */
    const capitalize_regex = /(\w)\S*/g;
    return str.replace(capitalize_regex, (match, firstChar) => {
        return firstChar.toUpperCase() + match.slice(1)
    })
}

module.exports = capitalize;