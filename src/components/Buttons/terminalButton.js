import styles from './terminalButton.module.css';

const TerminalButton = ({ icon, ...props }) => {
    return (
        <button
            className={styles["btn-glitch"]}
            style={{ backgroundColor: hoverColor }}
            {...props}
        >
            <i class="fa fa-instagram" aria-hidden="true"></i>
            <span> - Instagram</span>
        </button>
    );

};

export default TerminalButton;