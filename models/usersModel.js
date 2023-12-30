import fs from 'fs'
import { filePath } from '../utils/dataFilePath.js'

const initializeUsersFile = () => {
    if(!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath,JSON.stringify([]),'utf8')
    }
}

const readusersFromFile = () => {
    try {
        initializeUsersFile()
        const fileData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileData)
    } catch (error) {
        throw new Error("Error reading from movie file")
    }
}

const writeusersToFile = (user) => {
    try {
        initializeUsersFile()
        fs.writeFileSync(filePath,JSON.stringify(user), 'utf-8')
    } catch (error) {
        throw new Error("Error writing to the users file")
    }
}

export {readusersFromFile, writeusersToFile}