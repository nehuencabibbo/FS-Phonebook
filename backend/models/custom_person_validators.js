function isNumeric(str) {
    if (typeof str != "string") return false;

    let isANumber = !isNaN(Number(str))
    let isInt = Number(str) % 1 === 0

    return isANumber && isInt
}

function number_format_is_correct(number) {
    let splited_number = number.split("-")

    return splited_number.length == 2
}

function first_part_is_numeric(number) {
    let splited_number = number.split("-")

    return isNumeric(splited_number[0])
}

function first_part_has_two_or_three_numbers(number) {
    let splited_number = number.split("-")

    let first_part_has_two_characters = splited_number[0].length === 2
    let second_part_has_three_characters = splited_number[0].length === 3

    return first_part_has_two_characters || second_part_has_three_characters
}

function second_part_is_numeric(number) {
    let splited_number = number.split("-")

    return isNumeric(splited_number[1])
}

const number_validators = [
    {validator: number_format_is_correct, message: "Number format should be two number separated by -"},
    {validator: first_part_is_numeric, message: "First part of the number is not numeric"},
    {validator: first_part_has_two_or_three_numbers, message: "First part does not have two or three numbers"},
    {validator: second_part_is_numeric, message: "Second part of the number is not numeric"}
]

module.exports = {number_validators}