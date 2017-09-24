module.exports = {
    "extends": "google",
    "parserOptions": {
        "ecmaVersion": 7,
        "sourceType": "module",
        "ecmaFeatures" : {
            "experimentalObjectRestSpread": true
        }
    },
    "rules":{
        "max-len": "warn",
        "max-len/ignoreComment": "off",
        "no-invalid-this": "off",
        "new-cap": "off",
        "require-jsdoc": "off",
    }
};
