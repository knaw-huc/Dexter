const env = process.env

export default class Config {
    static BACKEND_HOST: string

    public static init() {
        for (const key of Object.keys(this)) {
            (this as any)[key] = this.setEnvVar(env, key)
        }
    }

    private static setEnvVar(env: any, key: string): string {
    // See: https://create-react-app.dev/docs/adding-custom-environment-variables/
        const fullEnvVar = "REACT_APP_" + key

        const value: string | undefined = env[fullEnvVar]
        if (!value) {
            throw Error(`environment variable ${fullEnvVar} is not set`)
        }
        return value
    }

}

//Config.init()