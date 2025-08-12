// import './button.css';
import PropTypes from 'prop-types';

const Button = ({
  text = 'Click',
  width,
  height,
  padding,
  fontsize,
  fontweight,
  borderradius,
  className,
  onclick,
  backgroundcolor,
  color,
  style,
}) => {
  return (
    <div className="button">
      <button
        style={{
          width: width,
          height: height,
          padding: padding,
          fontSize: fontsize,
          fontWeight: fontweight,
          borderRadius: borderradius,
          backgroundColor: backgroundcolor,
          color: color,
          ...style,
        }}
        className={className}
        onClick={onclick}
      >
        {text}
      </button>
    </div>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fontsize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fontweight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderradius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  onclick: PropTypes.func,
  backgroundcolor: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
};

export default Button;
