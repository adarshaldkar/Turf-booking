import './Input.css';
import PropTypes from 'prop-types';

const Input = ({
  type,
  placeholder,
  label,
  classname,
  onChange,
  onClick,
  value,
  id,
}) => {
  return (
    <div className="input">
      <h4>{label}</h4>
      <input
        type={type}
        placeholder={placeholder}
        className={classname}
        onChange={onChange}
        onClick={onClick}
        value={value}
        id={id}
      />
    </div>
  );
};
Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  classname: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  id: PropTypes.string,
};

export default Input;
// export default Input;
