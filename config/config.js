const config = {
    app:{
        port: 5005,
    },
    mongodb: {
        "host" :"127.0.0.1",
        "database":"tenant",
        "port": "27017"
    },
    postgres: {
        "host" :"postgres",
        "database":"tenant",
        "user":"tenant",
        "password":"dummy",
        "port":"5432",
        "maxConnection":"20",
        "minConnection":"4"

    },
    tenant: [1,3,4,5,7],
};

module.exports = config;