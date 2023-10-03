export interface StatusService {

    getAllStatus: () => Promise<string[]>
    getStatus: (name: string) => Promise<number>
    createStatus: (name: string) => Promise<string>
    removeStatus: (name: string) => Promise<void>
    updateStatus: (name: string, newName: string) => Promise<string>

}