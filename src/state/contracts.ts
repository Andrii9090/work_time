import { State } from ".";

interface IRepository {
    setState(state: State): void
    getState(): State
    updateData(data: any): void
}

export { IRepository }