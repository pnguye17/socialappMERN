import React, { Fragment } from 'react'
import spinner from './spinner.gif'

const SpinStyle = {
    width: '200px',
    display: 'block',
    margin: 'auto'
}

const Spinner = () => (
    <Fragment>
        <img
            src={spinner}
            style={SpinStyle}
            alt="Loading..." />
    </Fragment>
)

export default Spinner 