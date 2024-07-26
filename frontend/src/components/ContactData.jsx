const FormInputField = ({label, value, onChange}) => (
    <div>
        <label htmlFor={label}>{label}: </label>
        <input 
        id={label} 
        value={value} 
        onChange={onChange}
        autoComplete="off"/>
    </div>
)

const Button = ({label}) => (
    <div>
        <button name={label + "Button"} type="submit">
        {label}
        </button>
    </div>
)

const ContactData = ({addPerson, newName, newNumber, handleNewName, handleNewNumber}) => (
    <form id="contactForm" onSubmit={addPerson}>
    <FormInputField 
        label="name" 
        value={newName} 
        onChange={handleNewName}/>

    <FormInputField 
        label="number" 
        value={newNumber} 
        onChange={handleNewNumber}/>

    <Button
        label="add"/>
    </form>
)

export default ContactData