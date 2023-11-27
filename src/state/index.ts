import { RedisClientType, createClient } from "redis";


class State {
    name: string
    [key: string]: any

    constructor(name: string, data: object) {
        this.name = name
        this.data = data
    }
}

class StateRepository {
    repository: RedisClientType;
    constructor() {
        this.repository = createClient()
        this.repository.on('error', err => console.log('Redis Client Error', err));
        this.repository.connect();
    }

    async setState(userId: number, state: State) {
        this.repository.set(userId.toString(), JSON.stringify(state))
    }

    async removeState(userId: number) {
        this.repository.del([userId.toString()])
    }

    async getState(userId: number) {
        return await this.repository.get(userId.toString())
    }
}

export { StateRepository, State }