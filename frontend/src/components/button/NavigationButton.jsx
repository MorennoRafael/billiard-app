import "react";
import PropTypes from "prop-types";

function NavigationButton({
  icon: Icon,
  text,
  imgSrc,
  onClick,
  onClickTwo,
  color,
  isSelectedTableEmpty,
  isLampOn,
}) {
  const isDisabled = isSelectedTableEmpty || isLampOn === 1;
  const iconProps = isDisabled
    ? { className: "text-primary-light" }
    : { style: { color: color } };

  return (
    <div className="flex items-center justify-between py-2 px-3 border border-double-light rounded-md">
      <button
        className={`flex w-full gap-2 ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        onClick={isDisabled ? null : onClick}
        disabled={isDisabled}
      >
        {imgSrc ? (
          <img src={imgSrc} className="h-6" alt="icon" />
        ) : (
          Icon && <Icon size={24} {...iconProps} />
        )}
        <p className={`text-base font-semibold ${isDisabled ? "text-primary-light" : "text-black-primary"}`}>
          {text}
        </p>
      </button>
      {Icon && imgSrc && (
        <button
          onClick={isDisabled ? null : onClickTwo}
          disabled={isDisabled}
        >
          <Icon size={18} className={`cursor-pointer ${isDisabled ? "text-primary-light" : "text-black-primary"}`} />
        </button>
      )}
    </div>
  );
}

NavigationButton.propTypes = {
  icon: PropTypes.elementType,
  text: PropTypes.string.isRequired,
  imgSrc: PropTypes.string,
  onClick: PropTypes.func,
  onClickTwo: PropTypes.func,
  color: PropTypes.string,
  isSelectedTableEmpty: PropTypes.bool.isRequired,
  isLampOn: PropTypes.number,
};

export default NavigationButton;