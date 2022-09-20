import React from "react";
import Flip from 'react-reveal/Flip';
import Fade from 'react-reveal/Fade';
import Slide from 'react-reveal/Slide';

export const SKTransition = (props: any) => {
  const { transition } = props;
  if (transition == "SWIPE_IN_LEFT") {
    return (
      <Slide left>
        {props.children}
      </Slide>
    )
  } else if (transition == "FADE") {
    return (
      <Fade speed={3000}>
        {props.children}
      </Fade>
    )
  } else {
    return (
      <Flip left>
        {props.children}
      </Flip>
    )
  }

}
