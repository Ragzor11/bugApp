const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

  useEffect(() => {
    onSetFilterBy(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    switch (target.type) {
      case 'number':
      case 'range':
        value = +value || ''
        break
      default:
        break
    }

    setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
  }

  function onSubmitFilter(ev) {
    ev.preventDefault()
    onSetFilterBy(filterByToEdit)
  }

  const { txt, severity } = filterByToEdit
  return (
    <section className='bug-filter'>
      <h2>Filter Our Bugs</h2>
      <form onSubmit={onSubmitFilter}>
        <label htmlFor='txt'>Text: </label>
        <input value={txt} onChange={handleChange} type='text' placeholder='By text' id='txt' name='txt' />

        <label htmlFor='severity'>Severity: </label>
        <input
          value={severity}
          onChange={handleChange}
          type='number'
          placeholder='By Severity'
          id='severity'
          name='severity'
        />

      </form>
    </section>
  )
}
