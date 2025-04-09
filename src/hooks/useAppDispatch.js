import { useDispatch, useSelector } from 'react-redux';
import { store } from '../redux/store';

// Use this custom hook instead of plain useDispatch
export const useAppDispatch = () => useDispatch();
// Use this custom hook instead of plain useSelector
export const useAppSelector = () => useDispatch();