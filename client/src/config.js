let env = process.env.NODE_ENV
console.log('env:', env)

const config = {
    API_HOST: '/'
}

if (env === 'development') {
    config['API_HOST'] = '/'
}

export default config