import chalk from 'chalk';
import {
   PaymentStatus,
   RentalReqStatus,
} from '../../../generated/prisma/enums';
import config from '../../config';
import { prisma } from '../../lib/prisma';
import stripe from '../../lib/stripe';

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

      console.log(rentalRequest)

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

      const existingPayment = await prisma.payment.findUnique({
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

      
   

   return {
      checkOutUrl: session.url
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
            throw new Error('Payment was not completed.');
         }

         if (!rentalRequestId || !propertyId || !tenantId) {
            throw new Error('Invalid session metadata.');
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
// const createPaymentIntent = async()=>{}
// const createPaymentIntent = async()=>{}

export const paymentServices = {
   createPaymentIntent,
   handleWebhook,
};
