import PropTypes from "prop-types";
import styles from './menu-button.module.css';

// https://codepen.io/jh3y/pen/PoGbxLp
const MenuButton = ({ icon: Icon, text, tag, selected, ...props }) => {
    return (
        <div className={styles.wrapper}>
            <button className={styles.button} {...props}>
                {Icon ? <Icon /> : null}
                <span className={styles.text}>{text}</span>
            </button>
            <div className={styles.shadow} />
        </div>
    );

};

MenuButton.propTypes = {
    icon: PropTypes.elementType,
    text: PropTypes.string,
    tag: PropTypes.string
};

export default MenuButton;