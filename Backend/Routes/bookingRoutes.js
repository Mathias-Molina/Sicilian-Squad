import express from 'express';
import {
  createBookingHandler,
  getBookingHandler,
  getAvailableSeatsHandler,
  getUserBookingsHandler,
  getAllBookingsHandler,
  getDetailedUserBookingsHandler,
  getBookingByNumberHandler,
} from '../Controllers/bookingController.js';
import {
  getSeatsByBookingIdHandler,
  getDetailedSeatsByBookingIdHandler,
} from '../Controllers/seatsController.js';
import authMiddleware from '../Middleware/auth.js';
import optionalAuth from '../Middleware/optionalAuth.js';
import isAdmin from '../Middleware/isAdmin.js';

export const bookingRouter = express.Router();

bookingRouter.post('/', optionalAuth, createBookingHandler);

bookingRouter.get('/user/:userId', authMiddleware, getUserBookingsHandler);

bookingRouter.get('/admin', authMiddleware, isAdmin, getAllBookingsHandler);

bookingRouter.get('/:bookingId', authMiddleware, getBookingHandler);

bookingRouter.get('/screening/:screeningId/seats', getAvailableSeatsHandler);

bookingRouter.get('/:bookingId/seats', getDetailedSeatsByBookingIdHandler);

bookingRouter.get(
  '/user/:userId/detailed',
  authMiddleware,
  getDetailedUserBookingsHandler
);

bookingRouter.get('/number/:bookingNumber', getBookingByNumberHandler);
