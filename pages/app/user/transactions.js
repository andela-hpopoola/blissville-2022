import React, { useContext } from 'react';
import Backend from '@/components/admin/Backend';
import { adminMenu } from '@/data/admin/sideMenu';
import { ContentLoader } from '@/components/utils/LoadingItems';
import { useSWRQuery } from '@/hooks/useSWRQuery';
import TabContent from '@/components/admin/TabContent';
import { DashboardTable } from './dashboard';
import { getShortDate } from '@/utils/date-helpers';
import { moneyFormatInNaira } from '@/utils/helpers';
import {
  ASSIGNED_PROPERTY_STATUS,
  PAYMENT_SOURCE_NAME,
  TRANSACTION_STATUS_NAME,
} from '@/utils/constants';
import { UserContext } from 'context/user';
import { OverdueBadge } from './my-properties';
import { Wallet } from 'iconsax-react';

const pageOptions = {
  key: 'transactions',
  pageName: 'Transactions',
};

const Transactions = () => {
  const { user } = useContext(UserContext);
  const id = user?.id;

  const [query, transactions] = useSWRQuery({
    name: id ? ['transactions', id] : id,
    endpoint: `api/transactions`,
    axiosOptions: {
      params: {
        populate: 'deep,3',
        'filters[user][id][$eq]': id,
        sort: 'createdAt:desc',
      },
    },
  });
  const [_, payments] = useSWRQuery({
    name: id ? ['assigned-properties', id] : id,
    endpoint: `api/assigned-properties`,
    axiosOptions: {
      params: {
        'filters[user][id][$eq]': id,
        'filters[status][$lt]': ASSIGNED_PROPERTY_STATUS.COMPLETE_PAYMENT,
        populate: '*',
      },
    },
  });
  const [__, offlinePayments] = useSWRQuery({
    name: id ? ['api/offline-payments', id] : id,
    endpoint: `api/offline-payments`,
    axiosOptions: {
      params: {
        'filters[users][id][$eq]': id,
        populate: 'deep,3',
      },
    },
  });

  const allTabs = [
    {
      title: 'Upcoming Payments',
      Component: () => <UpcomingPayments payments={payments} />,
    },
    {
      title: 'Transaction History',
      Component: () => <TransactionHistory transactions={transactions} />,
    },
    {
      title: 'Offline Payments',
      Component: () => <OfflinePayments offlinePayments={offlinePayments} />,
    },
  ];

  return (
    <Backend title="Transactions">
      <TabContent name="transactions" allTabs={allTabs} />
    </Backend>
  );
};

export const TransactionHistory = ({ transactions }) => {
  return (
    <DashboardTable title="Transaction History">
      {!transactions || transactions.length === 0 ? (
        <tr>
          <td colSpan="5">
            <p className="py-4 text-md text-center text-gray-700">
              <div className="mt-2">You have no transactions</div>
            </p>
          </td>
        </tr>
      ) : (
        transactions.map(
          (
            { attributes: { property, createdAt, amount, paymentSource } },
            index
          ) => (
            <tr key={index}>
              <th width="300">
                <span className="fw-semibold">{getShortDate(createdAt)}</span>
                <br />
                <span className="fw-light text-gray-700 text-xs">
                  {property?.name || property?.data?.attributes?.name} -{' '}
                  {property?.project?.name ||
                    property?.data?.attributes?.project.data.attributes.name}
                </span>
              </th>
              <td className="text-end">
                <span className="fw-semibold">
                  {moneyFormatInNaira(amount)}
                </span>
                <br />
                <span className="fw-semibold text-primary text-xs">
                  {PAYMENT_SOURCE_NAME[paymentSource]}
                </span>
              </td>
            </tr>
          )
        )
      )}
    </DashboardTable>
  );
};

export const UpcomingPayments = ({ payments }) => {
  return (
    <DashboardTable title="Upcoming Payments">
      {!payments || payments.length === 0 ? (
        <tr>
          <td colSpan="5">
            <p className="py-4 text-md text-center text-gray-700">
              <div className="mt-2">You have no upcoming payments</div>
            </p>
          </td>
        </tr>
      ) : (
        payments.map(
          (
            {
              attributes: {
                property,
                expectedNextPayment,
                project,
                paymentDueDate,
              },
            },
            index
          ) => (
            <tr key={index}>
              <th width="300">
                <span className="fw-semibold">
                  {paymentDueDate && getShortDate(paymentDueDate)}
                </span>
                <br />
                <span className="fw-light text-gray-700 text-xs">
                  {property?.name || property?.data?.attributes?.name} -{' '}
                  {project?.name || project?.data?.attributes?.name}
                </span>
              </th>
              <td className="text-end">
                <span className="fw-semibold">
                  {expectedNextPayment &&
                    moneyFormatInNaira(expectedNextPayment)}
                </span>
                <br />
                <span className="fw-semibold text-primary text-xs">
                  {paymentDueDate && <OverdueBadge date={paymentDueDate} />}
                </span>
              </td>
            </tr>
          )
        )
      )}
    </DashboardTable>
  );
};

const OfflinePayments = ({ offlinePayments }) => {
  return (
    <DashboardTable title="Offline Payments">
      {!offlinePayments || offlinePayments.length === 0 ? (
        <tr>
          <td colSpan="5">
            <p className="py-4 text-md text-center text-gray-700">
              <div className="mt-2">You have no offline transaction</div>
            </p>
          </td>
        </tr>
      ) : (
        offlinePayments.map(
          (
            { attributes: { assignedProperty, amount, paymentDate, status } },
            index
          ) => (
            <tr key={index}>
              <th width="300">
                <span className="fw-semibold">
                  {paymentDate && getShortDate(paymentDate)}
                </span>
                <br />
                <span className="fw-light text-gray-700 text-xs">
                  {
                    assignedProperty?.data?.attributes?.property?.data
                      ?.attributes?.name
                  }{' '}
                  -{' '}
                  {
                    assignedProperty?.data?.attributes?.project?.data
                      ?.attributes?.name
                  }
                </span>
              </th>
              <td className="text-end">
                <span className="fw-semibold">
                  {amount && moneyFormatInNaira(amount)}
                </span>
                <br />
                <span className="fw-semibold text-primary text-xs">
                  {status && TRANSACTION_STATUS_NAME[status]}
                </span>
              </td>
            </tr>
          )
        )
      )}
    </DashboardTable>
  );
};

export default Transactions;
