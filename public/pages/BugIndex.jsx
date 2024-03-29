import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { utilService } from '../services/util.service.js'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugSort } from '../cmps/BugSort.jsx'
import { userService } from '../services/user.service.js'

const { useState, useEffect, useRef } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [sortBy, setSortBy] = useState(bugService.getDefaultSort())
    const debouncedSetFilterBy = useRef(utilService.debounce(onSetFilterBy, 500))
    const backBtn = useRef()
    const nextBtn = useRef()


    useEffect(() => {
        if (filterBy.pageIdx === 0) backBtn.current.disabled = true
        else backBtn.current.disabled = false
        if (bugs && bugs.length && filterBy.pageIdx >= bugs.length / 3) nextBtn.current.disabled = true
        else nextBtn.current.disabled = false
        bugService.query(filterBy, sortBy).then(setBugs)
    }, [filterBy, sortBy])

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }
    function onSetSortBy(sortBy) {
        console.log('onSetSortBy')
        setSortBy(prevSort => ({ ...prevSort, ...sortBy }))
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            description: prompt('description?'),
            severity: +prompt('Bug severity?'),
            id: utilService.makeId()
        }
        console.log(bug)
        bugService
            .save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }
    function onChangePageIdx(diff) {
        setFilterBy({ ...filterBy, pageIdx: filterBy.pageIdx + diff })
    }


    return (
        <main>
            <h3>Bugs App</h3>
            <main>
                <BugFilter filterBy={filterBy} onSetFilterBy={debouncedSetFilterBy.current} />
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <BugSort sortBy={sortBy} onSetSortBy={onSetSortBy} />
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
                <button
                    ref={nextBtn}
                    onClick={() => {
                        onChangePageIdx(1)
                    }}
                >
                    +
                </button>
                {filterBy.pageIdx + 1}
                <button
                    ref={backBtn}
                    onClick={() => {
                        onChangePageIdx(-1)
                    }}
                >
                    -
                </button>
            </main>
        </main>
    )
}

