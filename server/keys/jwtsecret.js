let secret = process.env.JWT_SECRET;

if (secret === undefined || secret.length < 10) {
    console.log("No JWT_SECRET environment variable found. Using JWT secret from jwtsecret.js");
    secret = "indevsecret1234";
}

const jwtSecret = secret;

module.exports = jwtSecret;
