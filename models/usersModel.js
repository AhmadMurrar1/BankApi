import fs from 'fs'
import { filePath } from '../utils/dataFilePath.js'

const readusersFromFile = () => {
    try {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileData)
    } catch (error) {
        throw new Error("Error reading from movie file")
    }
}

const writeusersToFile = (user) => {
    try {
        fs.writeFileSync(filePath,JSON.stringify(user), 'utf-8')
    } catch (error) {
        throw new Error("Error writing to the users file")
    }
}

export {readusersFromFile, writeusersToFile}