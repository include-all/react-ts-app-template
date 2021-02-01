import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import exp from '../../store/action/exp'

const Test: React.FC = () => {
  const count: number = useSelector((state: { exp: number }) => state.exp)
  const dispatch = useDispatch()
  return (
    <div className="app">
      <p>{count}</p>
      <button type="button" onClick={() => dispatch(exp.increase(2))}>
        +2
      </button>
    </div>
  )
}

export default Test
