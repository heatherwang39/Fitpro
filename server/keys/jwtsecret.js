let secret = process.env.JWT_SECRET;

const inDev = true;
if (secret === undefined || secret.length < 10) {
    console.log("Invalid JWT secret in $JWT_SECRET");
    if (inDev) {
        console.log("***********************************************");
        console.log("***********************************************");
        console.log("Using development JWT secret instead");
        console.log("THIS IS INSECURE");
        console.log("SET inDev = false IN jwtsecret.js BEFORE DEPLOYING");
        console.log("***********************************************");
        console.log("***********************************************");
        secret = "indevsecret1234";
    } else {
        process.exit();
    }
}

const jwtSecret = secret;

module.exports = jwtSecret;
