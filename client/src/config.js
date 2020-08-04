let env = process.env.NODE_ENV
console.log('env:', env)

const config = {
    API_HOST: 'http://localhost:8080/'
}

if (env === 'development') {
    config['API_HOST'] = '/'
}

export default config