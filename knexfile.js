module.exports = {
    test:{
        client:'pg',
        version:'9.5',
        connection:{
            host:'localhost',
            user:'postgres',
            password:'saneto@044',
            database:'barriga'
        },
        migrations:{
            directory:'src/migrations',
        }
    }
}