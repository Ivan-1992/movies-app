import React from 'react'
import { Alert } from 'antd'

import './error-indicator.css'

const ErrorIndicator = () => {
  return (
    <div className="error-indicator">
      <Alert message="Произошла ошибка" type="error" />
    </div>
  )
}

export default ErrorIndicator
