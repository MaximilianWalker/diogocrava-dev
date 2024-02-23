import PropTypes from "prop-types";
import styles from './menu-button.module.css';

// https://codepen.io/jh3y/pen/PoGbxLp
const MenuButton = ({ className, icon: Icon, text, selected, expandable, ...props }) => {
    return (
        <div className={`${styles.wrapper} ${className}`}>
            <button
                className={styles.button}
                data-expandable={expandable}
                {...props}
            >
                {Icon ? <Icon /> : null}
                <span
                    className={styles.text}
                    data-icon={!!Icon}
                >
                    {text}
                </span>
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