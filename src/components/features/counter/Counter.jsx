import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppDispatch';
import { 
  increment, 
  decrement, 
  incrementByAmount,
  fetchCount,
  selectCount,
  selectCountStatus,
  selectCountError
} from '../../../redux/slices/counterSlice';
import Button from '../../common/Button';
import Input from '../../common/Input';

const Counter = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCount);
  const status = useAppSelector(selectCountStatus);
  const error = useAppSelector(selectCountError);
  
  const [incrementAmount, setIncrementAmount] = useState('2');
  const incrementValue = Number(incrementAmount) || 0;
  
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">Redux Counter</h2>
      
      <div className="text-center mb-6">
        <div className="text-5xl font-bold mb-4">{count}</div>
        
        <div className="flex justify-center space-x-4 mb-6">
          <Button onClick={() => dispatch(decrement())}>-</Button>
          <Button onClick={() => dispatch(increment())}>+</Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Input
            type="number"
            value={incrementAmount}
            onChange={(e) => setIncrementAmount(e.target.value)}
            aria-label="Set increment amount"
            className="text-center"
          />
          <Button 
            onClick={() => dispatch(incrementByAmount(incrementValue))}
            className="whitespace-nowrap"
          >
            Add Amount
          </Button>
        </div>
        
        <Button 
          variant="secondary"
          onClick={() => dispatch(fetchCount(incrementValue))}
          disabled={status === 'loading'}
          fullWidth
        >
          {status === 'loading' ? 'Loading...' : 'Add Async'}
        </Button>
        
        {error && (
          <div className="mt-2 text-sm text-error">{error}</div>
        )}
      </div>
    </div>
  );
};

export default Counter;