const { useEffect, useState } = React

export function BugSort({ sortBy, onSetSortBy }) {
  const [sortByToEdit, setSortByToEdit] = useState(sortBy)

  useEffect(() => {
    onSetSortBy(sortByToEdit)
  }, [sortByToEdit])

  function handleSortBy({ target: { value: sortBy } }) {
    console.log('sorting')
    setSortByToEdit(prevSort => ({ ...prevSort, value: sortBy }))
  }

  function handleSortDirection({ target: { checked } }) {
    console.log('changing direction of sorting')
    if (checked) setSortByToEdit(prevSort => ({ ...prevSort, direction: -1 }))
    else setSortByToEdit(prevSort => ({ ...prevSort, direction: 1 }))
  }

  return (
    <section className='bug-sort'>
      <h2>Sort</h2>
      <select name='sort' id='sort' onInput={handleSortBy}>
        <option value='title'>Title</option>
        <option value='severity'>Severity</option>
        <option value='createdAt'>CreatedAt</option>
      </select>
      <label htmlFor=''>
        reverse
        <input type='checkbox' name='direction' id='direction' onChange={handleSortDirection} />
      </label>
    </section>
  )
}
