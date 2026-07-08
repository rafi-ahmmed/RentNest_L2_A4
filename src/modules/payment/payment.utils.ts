import Stripe from 'stripe';
import {
   PaymentStatus,
   RentalReqStatus,
} from '../../../generated/prisma/enums.js';
import AppError from '../../errors/appError.js';
import { prisma } from '../../lib/prisma.js';
import httpStatus from 'http-status';
import { PrismaClient } from '../../../generated/prisma/client.js';


export const handleCheckOutComplete = async (
   session: Stripe.Checkout.Session
) => {
   const rentalRequestId = session.metadata?.rentalReqId;
   const tenantId = session.metadata?.tenantId;
   const propertyId = session.metadata?.propertyId;
   const amount = Number(session.amount_total);
   const transactionId = session.id;
   const method = session.payment_method_types[0] as string;
   const createdAt = session.created;
   const paidAt = new Date(createdAt * 1000);
   const status =
      session.payment_status === 'paid'
         ? PaymentStatus.COMPLETED
         : PaymentStatus.FAILED;

   if (session.payment_status !== 'paid') {
      throw new AppError(httpStatus.BAD_REQUEST, 'Payment was not completed.');
   }

   if (!rentalRequestId || !propertyId || !tenantId) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid session metadata.');
   }

   await prisma.$transaction(async (tx) => {
      await tx.property.findUniqueOrThrow({
         where: {
            id: propertyId,
         },
      });

      await tx.rentalRequest.findUniqueOrThrow({
         where: {
            id: rentalRequestId,
         },
      });

      // create payment
      await tx.payment.create({
         data: {
            rentalRequestId,
            amount,
            transactionId,
            method,
            status,
            paidAt,
            tenantId,
         },
      });

      // update property isAvailable Value
      await tx.property.update({
         where: {
            id: propertyId,
         },
         data: {
            iaAvailable: false,
         },
      });

      // Update Current Rental Request Status -> ACTIVE
      await tx.rentalRequest.update({
         where: {
            id: rentalRequestId,
         },
         data: {
            status: RentalReqStatus.ACTIVE,
         },
      });

      // rejected other users requests without mine
      await tx.rentalRequest.updateMany({
         where: {
            propertyId,
            status: {
               in: [RentalReqStatus.PENDING, RentalReqStatus.APPROVED],
            },
            NOT: {
               id: rentalRequestId,
            },
         },
         data: {
            status: RentalReqStatus.REJECTED,
         },
      });
   });
};
