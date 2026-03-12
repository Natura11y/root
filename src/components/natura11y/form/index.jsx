const Form = ({ ref, onSubmit = null, children }) => (
    <form ref={ref} onSubmit={onSubmit}>
        {children}
    </form>
);

export default Form;
