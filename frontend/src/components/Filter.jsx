const Filter = ({filterValue, handleFilterChange}) => (
    <div>
        Only show numbers that contain: <input value={filterValue} onChange={handleFilterChange}/>
    </div>
)

export default Filter