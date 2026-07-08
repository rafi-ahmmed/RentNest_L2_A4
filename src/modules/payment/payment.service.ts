import chalk from 'chalk';
import { RentalReqStatus } from '../../../generated/prisma/enums.js';
import config from '../../config/index.js';
import { prisma } from '../../lib/prisma.js';
import stripe from '../../lib/stripe.js';
import AppError from '../../errors/appError.js';
import httpStatus from 'http-status';
import { handleCheckOutComplete } from './payment.utils.js';

const endpointSecret = config.stripe_webhook_secret;

const createPaymentIntent = async (
   requestId: string,
   tenantId: string,
   userEmail: string
) => {
   // console.log(requestId, tenantId, userEmail);

   const rentalRequest = await prisma.rentalRequest.findFirst({
      where: {
         id: requestId,
         tenant: {
            id: tenantId,
            email: userEmail,
         },
      },
      include: {
         tenant: {
            select: {
               id: true,
               email: true,
            },
         },
         properties: {
            select: {
               id: true,
               title: true,
               description: true,
               rent: true,
               iaAvailable: true,
            },
         },
      },
   });

   // console.log(rentalRequest);

   if (!rentalRequest) {
      throw new AppError(
         httpStatus.NOT_FOUND,
         'Rental request not fount what u want for pay'
      );
   }

   if (rentalRequest.status !== RentalReqStatus.APPROVED) {
      throw new AppError(
         httpStatus.CONFLICT,
         'Payment is only allowed . This rental request has not been approved yet.'
      );
   }

   if (rentalRequest.properties.iaAvailable === false) {
      throw new AppError(
         httpStatus.CONFLICT,
         'This property has already been rented.'
      );
   }

   const existingPayment = await prisma.payment.findUnique({
      where: {
         rentalRequestId: rentalRequest.id,
      },
   });

   if (existingPayment) {
      throw new AppError(
         httpStatus.CONFLICT,
         'Payment has already been completed for this rental request'
      );
   }

   const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: rentalRequest.tenant.email,

      line_items: [
         {
            price_data: {
               currency: 'bdt',

               product_data: {
                  name: rentalRequest.properties.title,
               },

               unit_amount: Number(rentalRequest.properties.rent) * 100,
            },
            quantity: 1,
         },
      ],
      metadata: {
         rentalReqId: rentalRequest.id,
         tenantId: rentalRequest.tenant.id,
         propertyId: rentalRequest.properties.id,
      },
      success_url: `${config.app_url}/api/payments/success`,
      cancel_url: `${config.app_url}/api/payments/success`,
   });

   return {
      checkOutUrl: session.url,
   };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
   const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret
   );

   switch (event.type) {
      case 'checkout.session.completed':
         const session = event.data.object;

         await handleCheckOutComplete(session);

         break;
      case 'payment_intent.payment_failed':
         const paymentIntent = event.data.object;

         console.log('Payment failed.');
         console.log(paymentIntent.id);
         console.log(paymentIntent.last_payment_error?.message);

         break;
      default:
         // Unexpected event type
         console.log(`Unhandled event type ${event.type}.`);
   }
};

const getUserPayments = async (userId: string) => {
   const payments = await prisma.payment.findMany({
      where: {
         tenantId: userId,
      },
   });

   if (!payments.length) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payments not found');
   }

   const total = await prisma.payment.count({
      where: { tenantId: userId },
   });

   return { data: payments, total };
};

const getPaymentsById = async (paymentId: string, userId: string) => {
   const payment = await prisma.payment.findUnique({
      where: {
         id: paymentId,
      },
   });

   if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment data not found');
   }

   if (payment.tenantId !== userId) {
      throw new AppError(
         httpStatus.UNAUTHORIZED,
         'You are not authorized to access this payment'
      );
   }

   return payment;
};

export const paymentServices = {
   createPaymentIntent,
   handleWebhook,
   getUserPayments,
   getPaymentsById,
};
