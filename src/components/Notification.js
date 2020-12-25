import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message, type }) => {
  const notificationType = type ? type : 'normal'

  return(
    <div className={`notification ${notificationType}`}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string.isRequired
}

export default Notification