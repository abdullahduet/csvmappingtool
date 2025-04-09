import React from 'react';
import PropTypes from 'prop-types';
import { TypeAnimation as ReactTypeAnimation } from 'react-type-animation';

const TypeAnimation = ({
  sequences = [],
  wrapper = 'span',
  speed = 50,
  deletionSpeed = 40,
  repeat = Infinity,
  cursor = true,
  className = '',
}) => {
  return (
    <ReactTypeAnimation
      sequence={sequences}
      wrapper={wrapper}
      speed={speed}
      deletionSpeed={deletionSpeed}
      repeat={repeat}
      cursor={cursor}
      className={className}
    />
  );
};

TypeAnimation.propTypes = {
  sequences: PropTypes.array.isRequired,
  wrapper: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  speed: PropTypes.number,
  deletionSpeed: PropTypes.number,
  repeat: PropTypes.number,
  cursor: PropTypes.bool,
  className: PropTypes.string,
};

export default TypeAnimation;