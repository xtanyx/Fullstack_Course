const Notification = ({message, isSuccess}) => {
    if (message === null) {
        return null
    }

    const successStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    const failureStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    if (isSuccess){
        return (
            <p style={successStyle}>
                {message}
            </p>
        )
    }
    else {
        return (
            <p style={failureStyle}>
                {message}
            </p>
        )
    }
    
}

export default Notification