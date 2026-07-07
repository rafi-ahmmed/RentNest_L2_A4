import { RentalReqStatus } from '../../../generated/prisma/enums';
import config from '../../config';
import { prisma } from '../../lib/prisma';
import stripe from '../../lib/stripe';

const createPaymentIntent = async (
   requestId: string,
   tenantId: string,
   userEmail: string
) => {
   // console.log(requestId, tenantId, userEmail);

   const transactionResult = await prisma.$transaction(async (tx) => {
      const rentalRequest = await tx.rentalRequest.findFirst({
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

      if (!rentalRequest) {
         throw new Error('Rental request not fount what u want for pay');
      }

      if (rentalRequest.status !== RentalReqStatus.APPROVED) {
         throw new Error(
            'Payment is only allowed . This rental request has not been approved yet.'
         );
      }

      if (rentalRequest.properties.iaAvailable === false) {
         throw new Error('This property has already been rented.');
      }

      const existingPayment = await tx.payment.findUnique({
         where: {
            rentalRequestId: rentalRequest.id,
         },
      });

      if (existingPayment) {
         throw new Error(
            'Payment has already been completed for this rental request'
         );
      }

      console.log('app url', config.app_url);

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
         success_url: `${config.app_url}/payment/success`,
         cancel_url: `${config.app_url}/payment/success`,
      });
      
      return session.url
   });

   return {
      checkOutUrl: transactionResult,
   };
};

// const createPaymentIntent = async()=>{}
// const createPaymentIntent = async()=>{}
// const createPaymentIntent = async()=>{}

export const paymentServices = {
   createPaymentIntent,
};
