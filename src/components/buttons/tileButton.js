import styles from './tileButton.module.css';

// https://codepen.io/Stockin/pen/mzydLz
const TileButton = ({ icon, text, hoverColor, ...props }) => {
    return (
        <button
            className={styles.tileButton}
            style={{ backgroundColor: hoverColor }}
            {...props}
        >
            {icon}
            {text ? <span>{text}</span> : null}
        </button>
    );

};

export default TileButton;