import React from 'react'
import { Alert } from 'antd'

import './error-indicator.css'

const ErrorIndicator = (err) => {
  const text = `Произошла ошибка: ${err.err}`
  return (
    <div className="error-indicator">
      <Alert message={text} type="error" />
    </div>
  )
}

export default ErrorIndicator
