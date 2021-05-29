const bcrypt = require('bcrypt');

const hash = (input) => {
    const salt = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(input, salt);
}

const compare = (input, hashedInput) => {
    return bcrypt.compareSync(input, hashedInput);
}

module.exports = {
    hash,
    compare,
};