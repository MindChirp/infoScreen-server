const {View} = require("grandjs");



const Styles = {
    button: {
        color: "white",
        height: "fit-content",
        width: "fit-content",
        padding: "1rem 2rem", 
        backgroundColor: "#1B2630", 
        marginLeft: "auto",
        marginRight: "auto", 
        cursor: "pointer",
        borderRadius: "0.5rem",
        cursor: "pointer"
    },
    image: {
        height: "5rem", 
        width: "auto", 
        marginLeft: "auto",
        marginRight: "auto"
    },
    imageWrapper: {
        marginLeft: "auto",
        marginRight: "auto",
        height: "fit-content",
        width: "fit-content"
    }
}

const ver = () => {
    return(
    <div>
        <div style={Styles.imageWrapper}>
            <img src="cid:icon-image" style={Styles.image}></img>
        </div>
        <h1>An InfoScreen user has been registered using your email.</h1>
        <h3>If this is not you, you can disregard this email.</h3>
        <h3>However, if you wish to activate your new InfoScreen user, press the button below</h3>

        <button href="localhost:5000/verifyUser" style={Styles.button}>Activate User</button>
    </div>
    )
}

module.exports = ver;