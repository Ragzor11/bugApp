import { log } from "console";
import { utilService } from "./utils.service.js";
import fs from 'fs'

export const bugService = {
    query,
    getById,
    remove,
    save
}

const PAGE_SIZE = 3
const bugs = utilService.readJsonFile('data/bugs.json')


function query({ txt, severity, pageIdx }, { value, direction }) {
    let bugsToReturn = bugs
    if (value === 'title') {
        bugsToReturn = bugsToReturn.sort((a, b) => a.title.localeCompare(b.title))
    } else if (value === 'severity') {
        bugsToReturn = bugsToReturn.sort((a, b) => a.severity - b.severity)
    } else if (value === 'createdAt') {
        bugsToReturn = bugsToReturn.sort((a, b) => a.createdAt - b.createdAt)
    }
    if (direction === -1) bugsToReturn = bugsToReturn.reverse()

    if (txt) {
        const regExp = new RegExp(txt, 'i')
        bugsToReturn = bugsToReturn.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
    }

    if (severity) {
        bugsToReturn = bugsToReturn.filter(bug => bug.severity >= severity)
    }

    if (pageIdx !== undefined) {
        const startIdx = pageIdx * PAGE_SIZE
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return Promise.resolve(bugsToReturn)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) return Promise.reject('No Such Bar')
    const bug = bugs[bugIdx]
    if (!loggedinUser.isAdmin &&
        bug.creator._id !== loggedinUser._id) {
        return Promise.reject('Not your car')
    }

    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
    // return Promise.resolve()
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const bugIdx = bugs.findIndex(currBug => currBug._id === bug._id)
        if (bugs[bugIdx].creator._id !== loggedinUser._id) return Promise.reject('Not your Bug')
        bugs[bugIdx] = bug
    } else {
        bug = {
            _id: utilService.makeId(),
            title: bug.title,
            severity: +bug.severity,
            description: bug.description,
            createdAt: bug.createdAt,
            creator: loggedinUser

        }
        bugs.unshift(bug)
    }

    return _saveBugsToFile().then(() => bug)
}



function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}